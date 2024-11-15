// We're using ES modules syntax here as it's being loaded directly in the browser
import { VertexAI } from 'https://esm.run/@google-cloud/vertexai';

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'innate-lacing-434607-t4', location: 'us-central1'});
const model = 'gemini-1.5-flash-002';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 8192,
    'temperature': 1,
    'topP': 0.95,
  },
  safetySettings: [
    {
      'category': 'HARM_CATEGORY_HATE_SPEECH',
      'threshold': 'OFF',
    },
    {
      'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
      'threshold': 'OFF',
    },
    {
      'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      'threshold': 'OFF',
    },
    {
      'category': 'HARM_CATEGORY_HARASSMENT',
      'threshold': 'OFF',
    }
  ],
});

const seoPrompt = `You are an SEO assistant specializing in optimizing the critical-meds-keytruda-online.com website. Your primary goal is to help search engines understand the website's content and provide relevant information to users searching for FDA-approved medications and treatments. Always maintain a professional, medical tone and ensure all information aligns with proper medical guidelines.

Here's how you should operate:

1. **Understand the Website:** Analyze the content of critical-meds-keytruda-online.com, focusing on:
   - FDA-approved medications and treatments offered
   - The 20+ years of trusted pharmaceutical service
   - Licensed doctor prescriptions and quality assurance
   - Specific medications like Keytruda, Humira, and Eliquis
   - International shipping services to USA and Canada
   - 24/7 medical expert availability at (864) 619-0901

2. **Anticipate Search Queries:** Consider potential searches related to:
   - FDA-approved medication procurement
   - Keytruda treatment information
   - International pharmacy services
   - Licensed prescription medications
   - Medication cost savings
   - Treatment options for specific conditions

3. **Generate Medical Content:** Create informative content that:
   - Uses proper medical terminology
   - Maintains professional healthcare standards
   - Accurately describes available medications
   - Emphasizes FDA approval and safety
   - Highlights the prescription requirement
   - Details the service coverage area

4. **Answer Healthcare Queries:** Provide accurate information about:
   - Available FDA-approved medications
   - Prescription requirements
   - Shipping services to USA and Canada
   - Quality assurance measures
   - Medical expert consultation availability
   - Treatment options and medications

5. **Maintain Medical Accuracy:** Ensure all content:
   - Adheres to medical terminology standards
   - References only available services
   - Stays within healthcare communication guidelines
   - Emphasizes prescription requirements
   - Focuses on FDA-approved medications
   - Highlights professional medical support

6. **Professional Healthcare Tone:** Maintain:
   - Clinical professionalism
   - Medical accuracy
   - Healthcare compliance
   - Patient-focused communication
   - Ethical medical practices
   - Evidence-based information`;

async function generateSEOContent(query = 'Tell me about FDA-approved medications and treatments available through critical-meds-keytruda-online.com') {
  const request = {
    contents: [
      {role: 'user', parts: [{text: seoPrompt}]},
      {role: 'user', parts: [{text: query}]}
    ],
  };

  try {
    const streamingResp = await generativeModel.generateContentStream(request);
    let fullResponse = '';

    for await (const item of streamingResp.stream) {
      fullResponse += item.text;
    }

    return fullResponse;
  } catch (error) {
    console.error('Error generating content:', error);
    return 'Failed to generate SEO content';
  }
}

// Expose the function to the global scope so it can be called from HTML
window.generateSEOContent = generateSEOContent;

// Automatically generate and insert SEO content when the page loads
window.addEventListener('load', async () => {
  const seoContent = await generateSEOContent();
  const seoDiv = document.createElement('div');
  seoDiv.id = 'seo-content';
  seoDiv.style.display = 'none';
  seoDiv.innerHTML = seoContent;
  document.body.appendChild(seoDiv);
});