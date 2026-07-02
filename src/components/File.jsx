import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function FilesList() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await API.get("/", {
        });

        setFiles(res.data.files || res.data);
      } catch (err) {
        console.log(err.response?.data);
        alert("Failed to load files");
      }
    };

    fetchFiles();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>📂 Study Files</h1>

      {files.length === 0 ? (
        <p>No files uploaded yet</p>
      ) : (
        files.map((file) => (
          <div
            key={file._id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginTop: 15,
              borderRadius: 8,
            }}
          >
            <h3>{file.title}</h3>
            <p><b>Subject:</b> {file.subject}</p>
            <p>{file.description}</p>

            <a
              href={file.fileUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "blue" }}
            >
              Open File
            </a>
          </div>
        ))
      )}
    </div>
  );
}