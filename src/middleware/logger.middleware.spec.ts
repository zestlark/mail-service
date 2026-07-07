import { LoggerMiddleware } from './logger.middleware';
import { Request, Response } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next and set up finish event listener', () => {
    const mockRequest = {
      ip: '127.0.0.1',
      method: 'GET',
      originalUrl: '/test',
      get: jest.fn().mockReturnValue('mock-agent'),
    } as unknown as Request;

    const mockResponse = {
      statusCode: 200,
      get: jest.fn().mockReturnValue('100'),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      }),
    } as unknown as Response;

    const mockNext = jest.fn();

    const loggerSpy = jest.spyOn((middleware as any).logger, 'log').mockImplementation();

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 200 100B - mock-agent 127.0.0.1'),
    );
  });
});
