import express from "express";
import { check, validationResult } from "express-validator";


import { generateOTID, getUserIdByOTID, checkUserApproved, getMyData, getThirdPartyInformation } from "../database";
import fpaTokenMiddleware from "../helpers/fpaTokenMiddleware";
import { pushAuthRequestMessage } from "../helpers/pushMessage";

const router = express.Router();

router.post(
  "/generate",
  fpaTokenMiddleware,
  [check("userTokenData").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const result = await generateOTID({
      id: req.body.userTokenData.data.id,
    });

    switch (result.result) {
      case 200: {
        return res.status(201).json({
          result: result.data.otid,
        });
      }

      case -1:
      default: {
        return res.status(400).json({
          result: "Failed to generate OTID",
        });
      }
    }
  },
);

router.post("/fpa-auth-send", fpaTokenMiddleware, [check("userTokenData").exists(), check("channelId").exists(), check("authStatus").exists()], async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { channelId, authStatus, } = req.body;

  (req as any).io.emit("fpa_channel_join", {
    channelId,
  });
  (req as any).io.emit("auth_send", {
    channelId,
    response: {
      authStatus,
    }
  });

  return res.status(200).json("job_done");
});

router.post(
  "/:otid",
  [check("thirdparty-public-key").exists()],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const publicKey = req.body["thirdparty-public-key"];

    const [otidOwner, thirdPartyInfo] = await Promise.all([
      getUserIdByOTID({
        otid: req.params.otid
      }),
      getThirdPartyInformation({
        publicKey,
      })
    ]);

    if (otidOwner.result === -1) {
      return res.status(422).json({ result: "OTID is not valid." });
    }
    if (thirdPartyInfo.result === -1 || thirdPartyInfo.result === 404) {
      return res.status(422).json({ result: "There is not exists that thirdParty application." });
    }

    const userId = otidOwner.data.user;
    if (!userId) {
      return res.status(422).json({ result: "Invalid user id" });
    }

    const [
      userApproved,
      userDataResponse
    ] = await Promise.all([
      checkUserApproved({
        publicKey,
        userId,
      }),
      getMyData({ id: userId })
    ]);

    const userData = userDataResponse.result;

    if (userData === -1) {
      return res.status(404).json({ result: "User can't found..." });
    }

    switch (userApproved.result) {
      case 200: {
        const thirdPartyName = (thirdPartyInfo as { result: 200, data: IThirdPartySimpleInformation }).data.name;
        const channelId = `${userApproved.token}_${Date.now()}`;
        const targetUserGCMToken = (userData as ITokenData).fcm_token;
        // send push message
        pushAuthRequestMessage(targetUserGCMToken, thirdPartyName, channelId);

        return res.status(200).json({
          result: 200,
          channelId,
        });
      }
      case 404:
      case -1:
      default: {
        return res.status(404).json({
          result: "User can't found...",
        });
      }
    }
    /**
     * 1. OTID로 유저 검색과 해당 유저가 해당 써드파티에 승인되어 있는지 확인
     * 2. (승인됨) 유저에게 지문인식 요청
     * 3. (정보없음) 정보 없음을 전달
     * ==> 여기까지가 이 API 역할
     * 2-0, (지문인식 요청) : ?? 어떻게 써드파티 화면에서 지문인식을 기다리게 할것인가.
     * 2-1, (지문인식완료) 승인된 유저의 써드파티 토큰 전달과 로그인 성공 안내
     * 2-2, (지문인식실패) 지문인식 실패로인한 로그인 실패 안내

     */

  },
);


export default router;
