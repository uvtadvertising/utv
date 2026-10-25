// for run
// node scripts/check-testmail.js

import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.TESTMAIL_API_KEY;
const namespace = process.env.TESTMAIL_NAMESPACE;

if (!apiKey || !namespace) {
  console.error("Missing Testmail credentials in .env.local");
  process.exit(1);
}

async function checkTestmail() {
  try {
    console.log("Checking Testmail inbox...");

    const response = await axios.get(
      "https://api.testmail.app/api/json",
      {
        params: {
          apikey: apiKey,
          namespace,
          tag: "contact-test",
          pretty: true,
        },
      }
    );

    console.log("Testmail API connected successfully!");

    console.log("Emails received:", response.data.emails?.length ?? 0);

    console.log(
      "Subjects:",
      response.data.emails?.map((email) => email.subject) ?? []
    );
  } catch (error) {
    console.error(
      "Testmail error:",
      error.response?.data?.message || error.message
    );
  }
}

checkTestmail();