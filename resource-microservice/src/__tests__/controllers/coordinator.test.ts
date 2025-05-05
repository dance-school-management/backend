import { mockRequest, mockResponse } from "../../__mocks__";
import { test } from "../../controllers/coordinator";

describe('test', () => {
    it('should return test msg', () => {
        test(mockRequest, mockResponse);
        expect(mockResponse.send).
        toHaveBeenCalledWith('hello test');
    });
});