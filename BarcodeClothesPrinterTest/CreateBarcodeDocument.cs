using iTextSharp.text;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BarcodeClothesPrinter
{
    public class CreateBarcodeDocument
    {

        BarcodeLib.Barcode b;
        Document doc;
        FileStream fs;
        PdfWriter writer;

        public List<ProductBarcodeClass> Barcodes { set; get; }

        /// <summary>
        /// The Constructor 
        /// </summary>
        /// <param name="_pdfPath">The Path Of the PDF File Where You Want To Save  </param>
        public CreateBarcodeDocument(string _pdfPath)
        {

            b = new BarcodeLib.Barcode();
            doc = new Document(iTextSharp.text.PageSize.A4.Rotate());
            fs = new FileStream(_pdfPath, FileMode.Create, FileAccess.Write
               , FileShare.None);
            writer = PdfWriter.GetInstance(doc, fs);

        }

        public CreateBarcodeDocument(string _pdfPath, Rectangle pageSize)
        {
            b = new BarcodeLib.Barcode();
            doc = new Document(pageSize.Rotate());
            fs = new FileStream(_pdfPath, FileMode.Create, FileAccess.Write
               , FileShare.None);
            writer = PdfWriter.GetInstance(doc, fs);
        }

        /// <summary>
        /// The Main Methode To Create The  Document 
        /// </summary>
        public void CreateDocument()
        {

            doc.Open();
            PdfContentByte cb = writer.DirectContent;
            int count = (Barcodes.Count / 4);
            for (int j = 0; j < count; j++)
            {
                int k = (j * 4);
                if (k != 0)
                    doc.NewPage();
                CreateEersteBarcode(Barcodes[k].ImageCode,
                                  Barcodes[k].ImageCode,
                                  Barcodes[k].ProductTypeRank);

                CreateTweedeBarcode(Barcodes[k + 1].ImageCode,
                                      Barcodes[k + 1].ImageCode,
                                      Barcodes[k + 1].ProductTypeRank);

                CreateDerdeBarcode(Barcodes[k + 2].ImageCode,
                                 Barcodes[k + 2].ImageCode,
                                 Barcodes[k + 2].ProductTypeRank);

                CreateVierdeBarcode(Barcodes[k + 3].ImageCode,
                                Barcodes[k + 3].ImageCode,
                                Barcodes[k + 3].ProductTypeRank);

            }


            doc.Close();

        }

        /// <summary>
        /// The Methode Where To create barcode 
        /// </summary>
        /// <param name="code"></param>
        /// <param name="point"></param>
        /// <returns></returns>
        iTextSharp.text.Image CreateImage(string code,
            System.Drawing.PointF point)
        {

            var barcodeImage = iTextSharp.text.Image.GetInstance(GetBarcodeImage(code));
            barcodeImage.SetAbsolutePosition(point.X, doc.PageSize.Height - point.Y);
            return barcodeImage;
        }


        void CreateChunck(string name, PdfWriter writer, Rectangle rect)
        {
            var cb = writer.DirectContent;

            //var rect = new iTextSharp.text.Rectangle(float.Parse(llx.Text), float.Parse(lly.Text),
            //  float.Parse(urx.Text), float.Parse(ury.Text));

            //var rect = new iTextSharp.text.Rectangle(180, 200, 325, 360);
            cb.Rectangle(rect);
            ColumnText ct = new ColumnText(cb);
            ct.SetSimpleColumn(rect);
            BaseFont bf = BaseFont.CreateFont(
                        BaseFont.TIMES_ROMAN,
                        BaseFont.CP1252,
                        BaseFont.EMBEDDED);
            Font font = new Font(bf, 24);
            Chunk ch = new Chunk(name, font);
            ct.AddElement(ch);
            ct.Go();


            cb.Stroke();

        }

        public void CreateA7BarcodeDocument()
        {

            doc.Open();
            PdfContentByte cb = writer.DirectContent;
            for (int i = 0; i < Barcodes.Count; i++)
            {
                if (i != 0)
                    doc.NewPage();
                CreateProductInfo(Barcodes[i].ImageCode, Barcodes[i].BarcodeLabel, Barcodes[i].ProductTypeRank);

            }
            doc.Close();

        }

        /// <summary>
        /// Create The Barcode with label and the text in the document 
        /// </summary>
        /// <param name="ImageCode">الكود المراد توليده </param>
        /// <param name="barcodeText">رقم الباركود </param>
        /// <param name="typeAndRank">نوع الباركود </param>
        void CreateProductInfo(string ImageCode, string barcodeText,
           string typeAndRank)
        {

            doc.Add(CreateImage(ImageCode,
               new System.Drawing.PointF((doc.PageSize.Height / 2) - 30, (doc.PageSize.Width / 2) - 50)));
            CreateChunck(typeAndRank, writer,
                new iTextSharp.text.Rectangle(100, 105, 200, 190));
            CreateChunck(barcodeText, writer,
                new iTextSharp.text.Rectangle(90, 50, 190, 120));


        }

        void CreateEersteBarcode(string ImageCode, string barcodeText,
            string typeAndRank)
        {

            doc.Add(CreateImage(ImageCode,
                new System.Drawing.PointF(150, 250)));
            CreateChunck(typeAndRank, writer,
                new iTextSharp.text.Rectangle(210, 200, 340, 435));
            CreateChunck(barcodeText, writer,
                new iTextSharp.text.Rectangle(180, 150, 325, 360));
        }

        void CreateTweedeBarcode(string ImageCode, string barcodeText,
       string typeAndRank)
        {

            doc.Add(CreateImage(ImageCode, new System.Drawing.PointF(500, 250)));
            CreateChunck(typeAndRank, writer, new iTextSharp.text.Rectangle(550, 150, 800, 435));
            CreateChunck(barcodeText, writer, new iTextSharp.text.Rectangle(535, 150, 780, 360));
        }

        void CreateDerdeBarcode(string ImageCode,
            string barcodeText, string typeAndRank)
        {

            doc.Add(CreateImage(ImageCode, new System.Drawing.PointF(150, 500)));
            CreateChunck(typeAndRank, writer, new iTextSharp.text.Rectangle(180, 50, 325, 190));
            CreateChunck(barcodeText, writer, new iTextSharp.text.Rectangle(180, 0, 325, 110));
        }

        void CreateVierdeBarcode(string ImageCode, string barcodeText,
         string typeAndRank)
        {

            doc.Add(CreateImage(ImageCode, new System.Drawing.PointF(500, 500)));
            CreateChunck(typeAndRank, writer, new iTextSharp.text.Rectangle(550, 50, 800, 190));
            CreateChunck(barcodeText, writer, new iTextSharp.text.Rectangle(535, 0, 780, 110));
        }


        iTextSharp.text.Image GetBarcodeImage(string barcode_string)
        {

            System.Drawing.Image myimg =
              b.Encode(BarcodeLib.TYPE.CODE128A, barcode_string.Trim()
                    , System.Drawing.Color.Black,
                   System.Drawing.Color.White, 180, 50);

            iTextSharp.text.Image jpg =
                          iTextSharp.text.Image.
                          GetInstance(myimg, new BaseColor(System.Drawing.Color.Black));


            jpg.Alignment = Element.ALIGN_CENTER;


            return jpg;
        }


    }

  


}
