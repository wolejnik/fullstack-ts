import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payloadToValidate: Record<string, any> = {};
      if (req.body && Object.keys(req.body).length > 0) payloadToValidate.body = req.body;
      if (req.query && Object.keys(req.query).length > 0) payloadToValidate.query = req.query;
      if (req.params && Object.keys(req.params).length > 0) payloadToValidate.params = req.params;

      const parsed = await schema.parseAsync(payloadToValidate);
      
      // 3. Express 5 Safe Assignment: Safely inject parsed data back into the request context
      if (parsed.body) {
        req.body = parsed.body;
      }
      
      if (parsed.query) {
        for (const key in req.query) { delete req.query[key]; }
        Object.assign(req.query, parsed.query);
      }
      
      if (parsed.params) {
        for (const key in req.params) { delete req.params[key]; }
        Object.assign(req.params, parsed.params);
      }
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("=== RAW ZOD ERROR ===", JSON.stringify(error.format(), null, 2));
        
        return res.status(400).json({
          status: 'fail',
          errors: error.errors.map(err => ({
            field: err.path.filter(p => p !== 'body' && p !== 'query' && p !== 'params').join('.') || 'root',
            message: err.message
          }))
        });
      }
      
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };
};