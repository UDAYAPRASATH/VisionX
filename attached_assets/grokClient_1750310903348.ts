import fs from 'fs';
import path from 'path';
import { Groq } from 'groq-sdk';
import sharp from 'sharp';


export async function compareScreenshotsWithGroqLlava(
  baselinePath: string,
  currentPath: string,
  groqApiKey?: string,
  promptOverride?: string
): Promise<void> {
  async function getResizedDataUrl(imagePath: string, width: number = 32): Promise<string> {
    const buffer = await sharp(imagePath)
      .resize({ width })
      .jpeg({ quality: 40 })
      .toBuffer();
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  }

  const baselineDataUrl = await getResizedDataUrl(baselinePath);
  const actualDataUrl = await getResizedDataUrl(currentPath);

  
  let prompt: string;
  if (promptOverride) {
    prompt = promptOverride;
  } else {
    const promptPath = path.resolve('visual-prompt.txt');
    prompt = fs.readFileSync(promptPath, 'utf-8');
  }
  
  prompt += `\n\nBaseline image (data URL):\n${baselineDataUrl}\n\nCurrent image (data URL):\n${actualDataUrl}`;

  try {
    const groq = new Groq({ apiKey: groqApiKey || process.env.GROK_API_KEY });
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    // Save the report to a file
    const report = typeof response.choices[0]?.message?.content === 'string'
      ? response.choices[0].message.content
      : JSON.stringify(response, null, 2);
    const reportPath = path.resolve('visual-report', `${path.basename(baselinePath, path.extname(baselinePath))}-vs-${path.basename(currentPath, path.extname(currentPath))}.txt`);
    fs.mkdirSync('visual-report', { recursive: true });
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`Groq Visual Comparison Report saved to: ${reportPath}`);
    console.log(report);
  } catch (error) {
    console.error('Groq  API error:', error);
  }
}
