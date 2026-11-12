require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

async function scrumMasterAgent(requirement) {

  try {

    const response =
      await client.chat.completions.create({

        model: process.env.MODEL,

        messages: [
          {
            role: "system",
            content: `
You are an Agile Scrum Master.

Generate:
1. User Story
2. Acceptance Criteria
3. Tasks
4. Story Points
5. Risks
6. Dependencies
7. Sprint Plan
`
          },

          {
            role: "user",
            content: requirement
          }
        ]
      });

    console.log(
      response.choices[0].message.content
    );

  } catch(error) {

    console.error(error);

  }

}

scrumMasterAgent(
  "Create Telecom Billing Dashboard"
);