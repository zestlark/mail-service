import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch HttpException and format response', () => {
    const mockRequest = {
      url: '/test-error',
      method: 'GET',
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    const exception = new HttpException(
      'Bad Request Error',
      HttpStatus.BAD_REQUEST,
    );

    const loggerWarnSpy = jest
      .spyOn((filter as any).logger, 'warn')
      .mockImplementation();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        path: '/test-error',
        message: 'Bad Request Error',
        error: 'HttpException',
      }),
    );
    expect(loggerWarnSpy).toHaveBeenCalled();
  });

  it('should catch generic error, default to internal server error and format response', () => {
    const mockRequest = {
      url: '/test-server-error',
      method: 'POST',
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    const exception = new Error('Database connection failed');

    const loggerErrorSpy = jest
      .spyOn((filter as any).logger, 'error')
      .mockImplementation();

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: '/test-server-error',
        message: 'Database connection failed',
        error: 'Error',
      }),
    );
    expect(loggerErrorSpy).toHaveBeenCalled();
  });
});
