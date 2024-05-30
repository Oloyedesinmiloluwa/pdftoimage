import React, { useRef, useState } from "react";
import { generateThumbnails } from "../pdfConverter";
import JSZip from "jszip";
import Dropzone from "react-dropzone";
import { Box, Button, ButtonGroup } from "@mui/material";

const triggerDownload = (link: string) => {
  const a = document.createElement("a");
  a.href = link;
  a.download = "images";
  a.click();
};
type ImageType = { image: File; link: string };

const PdfConverter = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [fileType, setFileType] = useState({ mime: "image/png", ext: ".png" });
  const [iframeUrl, setIframeUrl] = useState("");
  const acceptList = { "application/pdf": [] };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const file = event.currentTarget.files?.[0];

    if (file) {
      const data = await generateThumbnails(file.name, {
        file,
        mime: fileType.mime,
        ext: fileType.ext,
      });
      console.log(data, "from generatethumbnail");
      if (data?.length) {
        // @ts-ignore
        setImages(
          data
            .filter((image) => !!image)
            .map((image) => ({ link: URL.createObjectURL(image), image }))
        );
        // imageRef.current.src = URL.createObjectURL(image);
      }
    }
  };
  const handleDrop = async (files: File[]) => {
    const file = files?.[0];
    console.log({ file });
    setIframeUrl(file.name); //URL.createObjectURL(file));
    if (file) {
      const data = await generateThumbnails(file.name, {
        file,
        mime: fileType.mime,
        ext: fileType.ext,
      });
      console.log(data, "from generatethumbnail");
      if (data?.length) {
        // @ts-ignore
        setImages(
          data
            .filter((image) => !!image)
            .map((image) => ({ link: URL.createObjectURL(image), image }))
        );
        // imageRef.current.src = URL.createObjectURL(image);
      }
    }
  };

  const handleDownload: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    const z = JSZip();
    // zip.files = { file1: images[0], file2: images[1]}
    const zip = z.folder("images") as JSZip;
    images.forEach(({ image }, i) => {
      zip.file(i + ".svg", image);
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      // see FileSaver.js
      // saveAs(content, "example.zip");
      triggerDownload(URL.createObjectURL(content));
    });
  };

  console.log(images, "images");
  return (
    <div>
      <Box>
        <Dropzone
          accept={acceptList}
          onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
        >
          {({ getRootProps, getInputProps }) => (
            <section
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                // justifyContent: "center",
              }}
            >
              <Box
                style={{
                  width: "40%",
                }}
              >
                <Box mb={2}>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button>PDF - PNG</Button>
                    <Button>PDF - JPEG</Button>
                    {/*
                     */}
                  </ButtonGroup>
                </Box>
                <div
                  style={{
                    border: "dashed 2px blue",
                    // width: "40%",
                    textAlign: "center",
                    height: "100px",
                  }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </Box>
            </section>
          )}
        </Dropzone>
      </Box>
      {!!images.length && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            {images.map((item, i) => (
              <img
                src={item.link}
                style={{
                  border: "solid 1px grey",
                  marginTop: "32px",
                  marginRight: "10px",
                  width: "100px",
                  height: "auto",
                }}
                alt={`preview-${i}`}
              />
            ))}
          </div>
          <Button
            style={{
              width: "300px",
              marginTop: 50,
              backgroundColor: "darkblue",
              color: "white",
            }}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      )}
      <iframe title="pdf preview" height={500} width={175} src={iframeUrl} />
      {/* <input type="file" onChange={handleChange} accept=".pdf" />
      <button onClick={handleDownload}>Download</button>}
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {images.map((item, i) => (
          <img
            src={item.link}
            style={{
              border: "solid 1px grey",
              marginTop: "16px",
              width: "50%",
              height: "auto",
            }}
            alt={`preview-${i}`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default PdfConverter;
