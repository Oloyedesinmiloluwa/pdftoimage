import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const prepareCanvas = (page: any) => {
  const scale = 1.5;
  const viewport = page.getViewport({ scale: scale });

  // Prepare canvas using PDF page dimensions
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  return { context, viewport, canvas };
};

interface FileOption {
    file?: File,
    url?: string,
    mime: string,
    ext: string,
};

export const generateThumbnails = async (resource_id: string, { file, url, ext, mime }: FileOption) => {
  if (!file && !url) return;
  return new Promise<File[]>((resolve, reject) => {
    const fileUrl = file ? URL.createObjectURL(file) : url;
    const loadingTask = pdfjs.getDocument({ url: fileUrl });

     loadingTask.promise
      .then(async (pdf) => {
        const noOfPages = pdf.numPages;
        const promises:Array<Promise<File>> = [];
        console.log({noOfPages});
        const pages = Array(noOfPages).fill(1);
            pages.forEach((item, page) => { 
              const promise = pdf.getPage(page + 1).then(function (page) {
          const { context, viewport, canvas } = prepareCanvas(page);
          // Render PDF page into canvas context
          if (context) {
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            const renderTask = page.render(renderContext);

          return renderTask.promise.then(function () {
            return new Promise<File>((resolve1, reject) => {
              canvas.toBlob(blob => {
                if (blob) {
                  const thumbnail = new File([blob], `thumbnail-${resource_id}${ext}`, {
                    type: mime,
                  });
                  console.log(thumbnail);
                  resolve1(thumbnail);
                }
              }, 'image/jpeg', 1);
            });
            });
          }
        });
        promises.push(promise as Promise<File>);

        })
        const data = await Promise.all(promises);
        resolve(data);
      })
      .catch(e => console.log(e));
  });
};
