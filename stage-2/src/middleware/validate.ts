// validate.ts (Modified to handle empty objects for defaults)
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // ✅ Always validate body, query, and params so Zod can apply .default() values!
      const payloadToValidate = {
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
      };

      const parsed = await schema.parseAsync(payloadToValidate);
      
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