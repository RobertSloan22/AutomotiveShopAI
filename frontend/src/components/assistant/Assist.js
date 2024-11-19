import OpenAI from "openai";
const openai = new OpenAI();

async function main() {
  const assistant = await openai.beta.assistants.create({
    name: "Auto Diagnostic Assistant",
    instructions: "You are an automotive diagnostic assistant. Help users diagnose car problems by asking relevant questions about symptoms, analyzing the responses, and providing potential causes and solutions. Use your knowledge of car mechanics, common problems, and diagnostic procedures to give accurate advice.",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-turbo-preview"
  });

  // Create a thread for the conversation
  const thread = await openai.beta.threads.create();

  // Add an initial message
  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: "My car is making a strange knocking sound from the engine. Can you help diagnose the issue?"
    }
  );

  // Create and stream the run
  const run = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: assistant.id
  })
    .on('textCreated', (text) => process.stdout.write('\nassistant > '))
    .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value));
}

main();

