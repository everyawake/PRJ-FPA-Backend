import testFoo from "../providerPrivateKeyGenerator";

describe("testFoo()", () => {
  describe("when given 1, 2", () => {
    it("should return 3", () => {
      expect(testFoo(1, 2)).toBe(3);
    });
  });
});
