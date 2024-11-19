import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

export class Retriever {
    static async initialize(url) {
        try {
            console.log('Initializing Retriever with URL:', url);
            // Initialize loader with provided URL
            const loader = new CheerioWebBaseLoader(url, {
                selector: "div.post, div.thread-content",
                transformElement: (element) => ({
                    title: element.find('.thread-title').text(),
                    content: element.find('.post-content').text(),
                    dtcCode: element.find('.dtc-code').text(),
                    date: element.find('.post-date').text()
                })
            });

            // Load and process documents
            const docs = await loader.load();
            
            // Split documents
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 300,
                chunkOverlap: 30,
            });
            const docSplits = await textSplitter.splitDocuments(docs);

            // Create vector store
            const vectorStore = await MemoryVectorStore.fromDocuments(
                docSplits,
                new OpenAIEmbeddings(),
                {
                    metadataFields: ["dtcCode", "date", "title"]
                }
            );

            // Create retriever instance
            const instance = new Retriever();
            instance.vectorStore = vectorStore;
            instance.model = new ChatOpenAI({ temperature: 0 });
            
            console.log('Retriever initialized successfully');
            return instance;
        } catch (error) {
            console.error("Error initializing Retriever:", error);
            throw error;
        }
    }

    async query(question, vehicleData) {
        try {
            const retriever = this.vectorStore.asRetriever({
                searchType: "similarity",
                searchKwargs: { k: 5 },
                filter: (doc) => doc.metadata.dtcCode !== null
            });

            const results = await retriever.getRelevantDocuments(question);
            
            // Format vehicle data to handle both structures
            const formattedVehicleData = {
                make: vehicleData?.make || vehicleData?.type?.split(' ')[1] || '',
                model: vehicleData?.model || vehicleData?.type?.split(' ')[2] || '',
                year: vehicleData?.year || vehicleData?.type?.split(' ')[0] || '',
                vin: vehicleData?.vin || '',
                engine: vehicleData?.engine || '',
                transmission: vehicleData?.transmission || '',
                mileage: vehicleData?.mileage || ''
            };

            const context = results.map(doc => doc.pageContent).join('\n\n');
            const vehicleContext = vehicleData ? 
                `Vehicle Information:
                Make: ${formattedVehicleData.make}
                Model: ${formattedVehicleData.model}
                Year: ${formattedVehicleData.year}
                VIN: ${formattedVehicleData.vin}
                Engine: ${formattedVehicleData.engine}
                Transmission: ${formattedVehicleData.transmission}
                Mileage: ${formattedVehicleData.mileage}` : '';

            const response = await this.model.invoke([
                new HumanMessage(
                    `You are an expert automotive diagnostic technician. Using the following forum discussions 
                    and vehicle information, provide a detailed analysis and response to this question: ${question}

                    ${vehicleContext}

                    Please structure your response in the following format:

                    1. Vehicle-Specific Information:
                    - Confirm if this DTC code is common for this make/model/year
                    - Note any TSBs or recalls related to this code for this vehicle
                    - Highlight any known issues specific to this engine/transmission

                    2. DTC Code Definition:
                    - Provide the full name and meaning of the DTC code
                    - Explain what system this code is related to
                    - Note any variations specific to this vehicle

                    3. Common Causes:
                    - List the most frequent causes of this issue
                    - Explain why these problems trigger this code
                    - Note any make/model specific variations

                    4. Symptoms:
                    - Describe observable symptoms
                    - Note any warning lights or dashboard indicators
                    - Mention any performance issues
                    - Include any make/model specific symptoms

                    5. Diagnostic Steps:
                    - Provide step-by-step troubleshooting procedures
                    - List any specific tools or equipment needed
                    - Include voltage readings or specifications where applicable
                    - Note any make/model specific diagnostic procedures

                    6. Repair Solutions:
                    - Detail the recommended repair procedures
                    - List any commonly needed parts
                    - Mention approximate repair costs if available
                    - Note any make/model specific repair considerations
                    - Include preventive maintenance tips

                    7. Additional Notes:
                    - Include any vehicle-specific information
                    - Mention any common misdiagnoses to avoid
                    - Add any relevant technical service bulletins (TSBs)
                    - Note any known manufacturer-specific issues

                    Context from forum discussions:
                    ${context}

                    Please focus on information relevant to this specific vehicle when available,
                    and provide general diagnostic information when vehicle-specific data is not found.`
                )
            ]);

            return response.content;
        } catch (error) {
            console.error("Error in query:", error);
            throw error;
        }
    }
} 