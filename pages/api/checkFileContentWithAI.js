const axios = require("axios");


const keys = [process.env.API_KEY1, process.env.API_KEY2, process.env.API_KEY3];

console.log("keys ", keys);

export default async function handler(req, res) {
  const { pdfString, filePath, fields } = req.body;
  const wordsArray = pdfString.trim().split(/\s+/);
  const first1000Words = wordsArray.slice(0, 1700);
  const last1000Words = wordsArray.slice(-500);
  let extractedpdfString = first1000Words.join(" ") + last1000Words.join(" ");
  const prompt = `Your task is to take this string and indetify if the string is from an academic paper \n\n
  you are to analyze the string for the following patterns \\n
  Techncal and formal language \n
  complex ideas and arguments \n
  objective tone \n
  analytical perspective \n
  presence of abstract and references \n
  
  If the document meets 50% of the listed pattern it is an academic document \n
  
  If it is academic extract the journal name, abstract, keywords, title ,author's name and references in this format;
  
  <p>journal name: extracted joiurnal name</p>
  <p>title: extrated title </p>;
  <p>author's name: extracted Author's Name</p>;
  <p>abstract: extracted Abstract</p>;
  <p>keywords: extracted keywords </p>;
  <div>refrences: list all the extracted references and put each reference on a new line wrap with a <p>{reference}</p> tag</div>;
  use exactly the given format above but if if the document is not academic say \n\n
  This is not an academic document. Here comes the string;
  
  ${extractedpdfString}
  `;
  const result = await useGPTchatSimple(prompt);
  const value = filterResultToReturn(result);
  console.log("filtered reult ", value);
  res.status(200).json(value);
}

async function useGPTchatSimple(prompt, temperature = 0.7) {
  let success = false;
  let retries = 0;
  let extraTimeWait = 0;
  let resContent;
  let keyIndex = Math.floor(Math.random() * keys.length);
  let apiKey = keys[keyIndex];
  while (!success && retries < 4) {
    try {
      resContent = await onlyGPTchat(prompt, temperature, apiKey);
      success = true;
    } catch (e) {
      console.log("Error OpenAI = ", e.message);
      // Sleep for a while before trying again
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Switch to the other API key
      keyIndex = Math.floor(Math.random() * keys.length);
      apiKey =
        keys[keyIndex] === apiKey
          ? filterArray(keys, apiKey)[0]
          : keys[keyIndex];
    }
    retries++;

    extraTimeWait += 2000;
  }

  if (!success) {
    console.error("Failed to get response from OpenAI API");
    return "Failed to get a response from OpenAI API";
  }

  // console.log("resContent = ", resContent);

  return resContent;
}

const filterArray = (array, element) => {
  return array.filter((e) => element != e);
};

async function onlyGPTchat(prompt, temperature = 0.7, apiKey) {
  let discussion = [
    {
      role: "user",
      content: prompt,
    },
  ];

  let response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      messages: discussion,
      model: "gpt-3.5-turbo",
      temperature: temperature,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log("response.data = ", response.data.choices[0].message.content);

  return response.data.choices[0].message.content;
}

const filterResultToReturn = (resultData) => {
  if (resultData.indexOf("This is not an academic document") != -1) {
    return {
      error: "The pdf document is not an academic data",
      data: null,
    };
  } else if (
    resultData.indexOf("Failed to get a response from OpenAI API") != -1
  ) {
    return {
      data: null,
      error: "Failed to get a response from OpenAI API",
    };
  } else {
    //splitting using <p> and <div> as delimiter
    const splitText = resultData
      .split(/<p>|<\/p>|<div>|<\/div>/)
      .filter((item) => item.trim() !== "");
    console.log("split text ", splitText);
    let obj = {
      error: null,
      data: {},
    };
    for (let i = 0; i < splitText.length; i++) {
      if (i < 5) {
        const item = splitText[i].split(":");
        obj["data"][item[0]] = item[1];
      }
      if (i > 5) {
        const item = splitText[i];
        if (obj["data"]["references"]) {
          const array = obj["data"]["references"];
          const newArray = [...array, item];
          obj["data"]["references"] = newArray;
        } else {
          obj["data"]["references"] = [item];
        }
      }
    }
    return obj;
  }
};

{
  /* <p>journal name: Nigerian Journal of Agriculture, Food and Environment</p>
<p>title: Post Clean-Up Assessment of Crude Oil Polluted Soils of Ikot Ada Udo in Ikot Abasi Local Government Area of Akwa Ibom State</p>;
<p>author's name: Samuel, E. A., Udoumoh, I. D. J., Uduak, I. G., Ukem, B. O., Sule, N. A., Robert, A. G.</p>;
<p>abstract: Environmental pollution through oil spills has reportedly caused serious damage to both aquatic and terrestrial ecosystems, destruction of forests and farmlands and severely affects the characteristics and management of agricultural soils. The objectives of this study were to assess total petroleum hydrocarbon (TPH) and associated heavy metal levels in soils affected by the 2007 soil spillage at Ikot Ada Udo in Ikot Abasi Local Government Area following cleanup (August 2008 – March 2009).</p>;
<p>keywords: post clean-up assessment, crude oil-polluted soils, soil characteristics, Ikot Abasi, Akwa Ibom State</p>;
<div>refrences: 
<p>Barakat, M. A., Abo-Aly, M. M., El-Desoky, H. S., Ghoneim, M. M., Awad, A. M., Arafa, A. A., & El-Morsi, A. A. (2016). Recovery of crude oil-impacted soil using combined treatment of biochar, earthworms and plants. Ecotoxicology and Environmental Safety, 133, 216-225.</p>
<p>Chukwu, L. O., & Udoh, B. T. (2014). Effects of crude oil pollution on soil physico */
}
