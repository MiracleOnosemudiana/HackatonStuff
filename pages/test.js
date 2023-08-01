import Head from "next/head";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const fileInputRef = React.useRef();
  const [data, setData] = useState(null);
  const [filepath, setFilepath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(!loading);
      setFilepath("");
      setData(null);
      setError(null)
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // The API response
      const responsData = await response.json();
      const { data, error } = responsData;
      if (!error) {
        setFilepath(data.filepath);
        delete data.filepath;
        setData(data);
      } else {
        setError(error);
      }
      //"author's name"
      //"journal name"
      //"references"
      //abstract
      //"title"
      console.log("the returned data ", data); // Log the response from the API
    } catch (error) {
      setError(error.message);
      console.log("error ", error);
    } finally {
      setLoading(false);
    }
  };

  const serverUpload = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/uploadFromServer", {
        method: "POST",
        body: JSON.stringify({
          filepath:
            "/home/jamiebones/Coding_Directory/Arweave-Hacks/arweave-academia-hackathon/arweave-hackathon/uploads/pdf/Osikhena_Oshomah_Resume_28-03-2023-13-38-22.pdf",
          metadata: [
            { name: "Content-Type", value: "application/pdf" },
            { name: "document-type", value: "cv" },
          ],
        }),
      });

      // The API response
      const data = await response.json();
      console.log(data); // Log the response from the API
    } catch (error) {
      console.log("error ", error);
    }
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          {loading && <p>Please Wait.........</p>}

          {error && <p>Error: {error}</p>}
          <form onSubmit={submitHandler}>
            <input type="file" ref={fileInputRef} />
            <button type="submit">Upload Academic Paper</button>
          </form>

          {data && (
            <div>
              <p>PDF Details</p>
              {/* //"author's name"
      //"journal name"
      //"references"
      //"title" */}

              <p>file path : {filepath}</p>

              <p>Author Name: {data["author"]}</p>

              <p>Journal Name: {data["journal_name"]}</p>

              <p>Paper Title: {data["title"]}</p>

              <p>Abstract: {data["abstract"]}</p>

              <p>Keywords: {data["keywords"]}</p>

              <p>Publication Date: {data["publication_date"]}</p>

              

           
            </div>
          )}
        </div>
      </main>
    </>
  );
}
