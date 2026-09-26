import {genkit} from 'genkit';
import openAICompatible from '@genkit-ai/compat-oai';

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY || false,
      baseURL: process.env.base_url,
    }),
  ],
  model: `openai/${process.env.model || 'gpt-4.1'}`,
});
