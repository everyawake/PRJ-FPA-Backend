import signUp from "./signUp";
import signIn from "./signIn";
import {
  getMyData,
  updateFingerAuthAbility,
  changeUserMode,
} from "./myInformation";
import { generateOTID, getUserIdByOTID } from "./otid";
import { addThirdApp, regeneratePublicKey, approveToThirdApp, checkUserApproved } from "./thirdParty";
import emailConfirm from "./emailConfirm"

export {
  signUp,
  signIn,
  getMyData,
  updateFingerAuthAbility,
  changeUserMode,
  generateOTID,
  getUserIdByOTID,
  addThirdApp,
  regeneratePublicKey,
  emailConfirm,
  approveToThirdApp,
  checkUserApproved
};
