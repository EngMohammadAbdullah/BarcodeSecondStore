using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
//using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
//using System.Windows.Shapes;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SocketIOClient;
using System.Net.Sockets;
using System.IO;
using System.Threading;
using Stimulsoft.Report;
using iTextSharp.text.pdf;
using iTextSharp.text;
using System.Diagnostics;
using dr = System.Drawing;
using Newtonsoft.Json;
using System.Net.NetworkInformation;
using BarcodeClothesPrinter.Classes;

namespace BarcodeClothesPrinter
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        BarcodeLib.Barcode b = new BarcodeLib.Barcode();

        public MainWindow()
        {
            InitializeComponent();

        }

        async Task MainAsync()
        {
            var mongoDB =
                "mongodb://eng_mohammad:mohammad224@ds123312.mlab.com:23312/barcode_clothes";

            var client = new MongoClient(mongoDB);
            IMongoDatabase db = client.GetDatabase("barcode_clothes");
            //var document = new Student
            //{
            //    Subjects = new[] { "English", "Mathematics", "Physics" },
            //    FirstName = "Peter",
            //    LastName = "Mbanugo ",
            //    Class = "English",
            //    Age = 54
            //};

            var collection = db.GetCollection<Student>("product ");
            // await collection.InsertOneAsync(document);
            //var count = collection.AsQueryable<Student>()
            //     .FirstOrDefault();
            //MessageBox.Show(count.ToString());
            var filter = new BsonDocument("FirstName", "Peter1");

            List<Student> dd = new List<Student>();
            await collection.Find(filter)
                     .ForEachAsync(document =>
                     {
                         dd.Add(document);
                         File.WriteAllText("first.txt", document.FirstName);
                     });


            //IMongoDatabase db = client.GetDatabase("barcode_clothes");

            //var collection = db.GetCollection<Types>("Types");
            //var filter = new BsonDocument();
            //using (var cursor =
            //    await collection.FindAsync(filter))
            //{
            //    while (await cursor.MoveNextAsync())
            //    {
            //        IEnumerable<Types> batch = cursor.Current;
            //        foreach (Types document in batch)
            //        {
            //            Console.WriteLine(document);
            //            Console.WriteLine();
            //        }
            //    }
            //}
        }

        private void UpdateButtonContent(string doc)
        {
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            //StiReport report = new StiReport();
            //report.Load("Report.mrt");
            //report.DesignV2WithWpf();

            //var writer = new PdfWriter("Hello.pdf");

            //var pdf = new PdfDocument();
            //pdf.AddNewPage();


            //var document = new Document(pdf);
            //iText.Layout.Element.AreaBreak p =
            //    new iText.Layout.Element.AreaBreak(new PageSize(100, 200));


            //document.Add(p);
            //document.Close();

            //try
            //{
            //    MainAsync().Wait();

            //}
            //catch (Exception ee)
            //{

            //    MessageBox.Show(ee.Message);
            //    throw;
            //}
        }

        private void CreatePdf(object sender, RoutedEventArgs e)
        {

            FileStream fs =
           new FileStream("Chapter1_Example1.pdf",
           FileMode.Create, FileAccess.Write, FileShare.None);


            iTextSharp.text.Rectangle rec2 = new iTextSharp.text.Rectangle(PageSize.A7.Rotate());
            Document doc = new Document(rec2);
            PdfWriter writer = PdfWriter.GetInstance(doc, fs);
            doc.Open();
            doc.Add(new iTextSharp.text.Paragraph("\n"));
            doc.Add(new iTextSharp.text.Paragraph("\n"));
            doc.Add(new iTextSharp.text.Paragraph("\n"));
            doc.Add(new iTextSharp.text.Paragraph("\n"));

            iTextSharp.text.Paragraph para =
                new iTextSharp.text.Paragraph("Hello World");
            // Setting paragraph's text alignment using iTextSharp.text.Element class
            //para.Alignment = 1000;
            para.Alignment = Element.ALIGN_CENTER;
            // para.FirstLineIndent = 100f;



            var barcode_string = "123456";

            for (int i = 1; i < 500; i++)
            {
                doc.NewPage();
                doc.Add(new Paragraph(string.Format("This is a page {0}", i)));
                doc.Add(GetBarcodeImage(barcode_string + i.ToString()));

            }
            doc.Close();
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
            ////Resize image depend upon your need

            //jpg.ScaleToFit(140f, 120f);

            ////Give space before image

            //jpg.SpacingBefore = 10f;

            //Give some space after the image

            //   jpg.SpacingAfter = 1f;

            jpg.Alignment = Element.ALIGN_CENTER;


            return jpg;
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {



            //System.Drawing.Image myimg =
            //    b.Encode(BarcodeLib.TYPE.CODE128A, "123456789".Trim()
            //          , System.Drawing.Color.Black,
            //         System.Drawing.Color.White, 380, 100);
            using (var ms = new MemoryStream())
            {
                DrawText("2 ccr Hello ").Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                ms.Position = 0;

                var bi = new BitmapImage();
                bi.BeginInit();
                bi.CacheOption = BitmapCacheOption.OnLoad;
                bi.StreamSource = ms;
                bi.EndInit();
                //img1.Source = bi;
            }


        }

        private void CustomePdfClick(object sender, RoutedEventArgs e)
        {
            //  FileStream fs =
            //new FileStream("CustomePage.pdf",
            //FileMode.Create, FileAccess.Write, FileShare.None);




            //  iTextSharp.text.Rectangle rec2 =
            //      new iTextSharp.text.Rectangle(PageSize.A4.Rotate());

            //  Document doc = new Document(rec2);
            //  PdfWriter writer = PdfWriter.GetInstance(doc, fs);
            //  doc.Open();

            //  iTextSharp.text.Paragraph para =
            //      new iTextSharp.text.Paragraph("\n \n \n Hello World");
            //  para.IndentationRight = 500f;


            //  doc.Add(para);
            //  PdfContentByte cb = new PdfContentByte(writer);

            //  BaseFont bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            //  cb.SaveState();
            //  cb.BeginText();
            //  cb.MoveText(700, 30);
            //  cb.SetFontAndSize(bf, 12);
            //  cb.ShowText("My status");
            //  cb.EndText();
            //  cb.RestoreState();
            //  ColumnText ct = new ColumnText(cb);
            //  ct.SetSimpleColumn(rec2);
            //  ct.AddElement(new Paragraph("This is the text added in the rectangle"));
            //  ColumnText.ShowTextAligned(cb, 100, new Phrase("ffffff"), 100f, 100f, 0);
            //  ct.Go();




            //  doc.Close();

            Rectangle r = new Rectangle(iTextSharp.text.PageSize.A4);

            Document doc = new Document(r);

            try
            {
                FileStream fs =
              new FileStream("CustomePage.pdf",
              FileMode.Create, FileAccess.Write, FileShare.None);

                PdfWriter pw = PdfWriter.GetInstance(doc, fs);

                doc.Open();

                string text = @"Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                            Suspendisse blandit blandit turpis. Nam in lectus ut dolor consectetuer bibendum. 
                            Morbi neque ipsum, laoreet id; dignissim et, viverra id, mauris. Nulla mauris elit, 
                            consectetuer sit amet, accumsan eget, congue ac, libero. Vivamus suscipit.
                            Nunc dignissim consectetuer lectus. Fusce elit nisi; commodo non, facilisis 
                            quis, hendrerit eu, dolor? Suspendisse eleifend nisi ut magna. Phasellus id
                            lectus! Vivamus laoreet enim et dolor. Integer arcu mauris, ultricies vel,
                            porta quis, venenatis at, libero. Donec nibh est, adipiscing et, ullamcorper
                            vitae, placerat at, diam. Integer ac turpis vel ligula rutrum auctor! Morbi 
                            egestas erat sit amet diam. Ut ut ipsum? Aliquam non sem. Nulla risus eros, mollis quis,
                            blandit ut; luctus eget, urna. Vestibulum vestibulum dapibus erat. Proin egestas leo a metus?";

                PdfContentByte cb = pw.DirectContent;
                cb.MoveTo(doc.PageSize.Width / 2, doc.PageSize.Height / 2);

                cb.LineTo(doc.PageSize.Width / 2, doc.PageSize.Height);

                cb.Stroke();

                cb.MoveTo(0, doc.PageSize.Height / 2);

                cb.LineTo(doc.PageSize.Width, doc.PageSize.Height / 2);

                cb.Stroke();


                //text =
                //    text.Replace(Environment.NewLine, String.Empty).
                //    Replace("  ", String.Empty);



                //Chunk beginning = new Chunk(text);

                //Phrase p1 = new Phrase(beginning);

                //Chunk c1 = new Chunk("You can of course force a newline using \"");
                //c1.SetUnderline(2f, 2.5f);
                //c1.SetWordSpacing(10f);

                ////p1.Add(c1);
                //Paragraph p = new Paragraph();
                //p.Add(p1);
                //p.SpacingBefore = 100;
                //p.SpacingAfter = 20;
                //p.PaddingTop = 100;
                //p.Alignment = 2;
                //p.PaddingTop = 100f;


                //doc.Add(p);
            }

            catch (DocumentException dex)

            {

                throw (dex);

            }

            catch (IOException ioex)

            {

                throw (ioex);

            }

            finally

            {

                doc.Close();

            }
        }

        Paragraph CreatePage(List<string> barcodes)
        {



            throw new NotImplementedException();

        }

        private void ItextClick(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process[] procs = null;
            try
            {
                procs = Process.GetProcessesByName("FoxitPhantomPDF");

                if (procs.Length > 0)
                {


                    Process mspaintProc = procs[0];

                    if (!mspaintProc.HasExited)
                    {
                        mspaintProc.Kill();
                    }

                }
            }
            catch (Exception)
            {

                throw;
            }
            finally
            {

                if (procs != null)
                {
                    foreach (Process p in procs)
                    {
                        p.Dispose();
                    }
                }
            }
            Thread.Sleep(500);
            FileStream fs = new FileStream("CustomePdf.pdf",
                FileMode.Create, FileAccess.Write, FileShare.None);
            Document doc = new Document(iTextSharp.text.PageSize.A4.Rotate());
            PdfWriter writer = PdfWriter.GetInstance(doc, fs);
            doc.Open();
            PdfContentByte cb = writer.DirectContent;



            //FileStream fs =
            //  new FileStream("CustomePage.pdf",
            //  FileMode.Create, FileAccess.Write, FileShare.None);
            //Document doc = new Document(iTextSharp.text.PageSize.A4.Rotate());
            //PdfWriter writer = PdfWriter.GetInstance(doc, fs);
            //doc.Open();
            //PdfContentByte cb = writer.DirectContent;

            var logo = iTextSharp.text.Image.GetInstance(GetBarcodeImage("123456789"));
            logo.SetAbsolutePosition(150, doc.PageSize.Height - 250);
            //logo.ScaleAbsoluteHeight(50);
            //logo.ScaleAbsoluteWidth(100);
            doc.Add(logo);


            logo = iTextSharp.text.Image.GetInstance(GetBarcodeImage("123456789"));
            logo.SetAbsolutePosition(500, doc.PageSize.Height - 250);
            //logo.ScaleAbsoluteHeight(50);
            //logo.ScaleAbsoluteWidth(100);
            doc.Add(logo);


            logo = iTextSharp.text.Image.GetInstance(GetBarcodeImage("123456789"));
            logo.SetAbsolutePosition(150, doc.PageSize.Height - 500);
            //logo.ScaleAbsoluteHeight(50);
            //logo.ScaleAbsoluteWidth(100);
            doc.Add(logo);

            logo = iTextSharp.text.Image.GetInstance(GetBarcodeImage("123456789"));
            logo.SetAbsolutePosition(500, doc.PageSize.Height - 500);
            //logo.ScaleAbsoluteHeight(50);
            //logo.ScaleAbsoluteWidth(100);
            doc.Add(logo);

            //var rect = new iTextSharp.text.Rectangle(float.Parse(llx.Text), float.Parse(lly.Text),
            //    float.Parse(urx.Text), float.Parse(ury.Text));
            //var rect = new iTextSharp.text.Rectangle(180, 150, 325, 360);
            ////   var rect = new iTextSharp.text.Rectangle(150, doc.PageSize.Height - 500);
            //cb.Rectangle(rect);
            //ColumnText ct = new ColumnText(cb);
            //ct.SetSimpleColumn(rect);
            //BaseFont bf = BaseFont.CreateFont(
            //            BaseFont.TIMES_ROMAN,
            //            BaseFont.CP1252,
            //            BaseFont.EMBEDDED);
            //Font font = new Font(bf, 24);
            //Chunk ch = new Chunk("123456789", font);
            //ct.AddElement(ch);
            //ct.Go();


            //cb.Stroke();

            CreateChunck("ccr 1,1 ", writer, new iTextSharp.text.Rectangle(230, 200, 350, 435));
            CreateChunck("ccr 1,2 ", writer, new iTextSharp.text.Rectangle(550, 150, 800, 435));
            CreateChunck("ccr 2,1 ", writer, new iTextSharp.text.Rectangle(180, 50, 325, 190));
            CreateChunck("ccr 2,2 ", writer, new iTextSharp.text.Rectangle(550, 50, 800, 190));
            CreateChunck("223456789", writer,
                new iTextSharp.text.Rectangle(float.Parse(llx.Text), float.Parse(lly.Text), float.Parse(urx.Text), float.Parse(ury.Text)));

            doc.Close();

            Process.Start("CustomePdf.pdf");

        }
        void CreateChunck(string name, PdfWriter writer, Rectangle rect)
        {

            PdfContentByte cb = writer.DirectContent;
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
        public dr.Image DrawText(String text)
        {
            dr.Bitmap objBmpImage = new dr.Bitmap(2, 2);

            dr.RectangleF rectf = new dr.RectangleF(70, 90, 90, 50);

            dr.Graphics g = dr.Graphics.FromImage(objBmpImage);

            g.SmoothingMode = dr.Drawing2D.SmoothingMode.AntiAlias;
            g.InterpolationMode = dr.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = dr.Drawing2D.PixelOffsetMode.HighQuality;
            g.DrawString("yourText", new dr.Font("Tahoma", 8), dr.Brushes.Black, rectf);

            g.Flush();

            return objBmpImage;
        }

        private void PdfClassButton_Click(object sender, RoutedEventArgs e)
        {
            BarcodeDocumentPdf pdf =
                new BarcodeDocumentPdf("Custome.pdf");
            List<ProductBarcodeClass> allCode = new List<ProductBarcodeClass>();
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            allCode.Add(new ProductBarcodeClass()
            {
                BarcodeLabel = "123456789",
                ImageCode = "123456789",
                ProductTypeRank = "CCR 2"
            });
            pdf.Barcodes = allCode;
            pdf.CreateDocument();

        }

        private void MongoDbButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var mongoreader = new MongoConnection();

                var ff = mongoreader.FindProductsBy("4312");

                var yy = ff[0].productNumbers.Cast<string>().ToList();

                //هنا عدد المنتجات اللازم طباعتها 
                var ProductNumbersByType = GetProductNumbersToPrint();

                //تحميل ملف الأنواع
                var typesNumbers = GetTypesNumbers();
                //الأرقام هنا من قاعدة البيانات 
                Stack<string> barcodeStack = new Stack<string>(yy);



                List<ProductBarcodeClass> allCode = new List<ProductBarcodeClass>();

                foreach (ProductCount item in ProductNumbersByType)
                {
                    string typeNumber = GetNumberOf(item.ProductName, typesNumbers);
                    for (int i = 0; i < item.PCount; i++)
                    {
                        string code = barcodeStack.Pop();
                        allCode.Add(new ProductBarcodeClass()
                        {
                            ImageCode = ff[0].containerNumber + code + typeNumber,
                            BarcodeLabel = ff[0].containerNumber + code + typeNumber,
                            ProductTypeRank = item.ProductName

                        });
                    }
                }


                mongoreader.UpdateProductCollection("4312", barcodeStack.ToArray());

                BarcodeDocumentPdf barcode =
                      new BarcodeDocumentPdf("custome.pdf");

                barcode.Barcodes = allCode;

                barcode.CreateDocument();




            }
            catch (Exception ee)
            {

                MessageBox.Show(ee.Message);
            }

        }

        private string GetNumberOf(string productName,
            IEnumerable<TypeNumbersClass> typesNumbers)
        {
            var gg = typesNumbers.Where(t => productName.StartsWith(t.pName)).Select(t => t.pNumber)
                 .FirstOrDefault();

            return gg == null ? "000" : gg;

        }

        private IEnumerable<TypeNumbersClass> GetTypesNumbers()
        {
            if (File.Exists("FileTypes.json"))
                return
                 JsonConvert.DeserializeObject<List<TypeNumbersClass>>(File.ReadAllText("FileTypes.json"));
            var list = new MongoConnection().GetProductTypes();

            File.WriteAllText("FileTypes.json", list.ToJson());
            return
                            JsonConvert.DeserializeObject<List<TypeNumbersClass>>(File.ReadAllText("FileTypes.json"));


        }

        private List<ProductCount> GetProductNumbersToPrint()
        {
            if (File.Exists("config_product_names.json"))
                return
                 JsonConvert.DeserializeObject<List<ProductCount>>(File.ReadAllText("config_product_names.json"));

            TypesNumberSelection typeWindwo = new TypesNumberSelection();
            typeWindwo.ShowDialog();
            return
                  JsonConvert.DeserializeObject<List<ProductCount>>(File.ReadAllText("config_product_names.json"));


        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {

        }

        private void GetTypesButton(object sender, RoutedEventArgs e)
        {
            var list = new MongoConnection().GetProductTypes();

            File.WriteAllText("FileTypes.json", list.ToJson());
        }


        public bool CheckForInternetConnection()
        {

            try
            {
                Ping myPing = new Ping();
                String host = "google.com";
                byte[] buffer = new byte[32];
                int timeout = 1000;
                PingOptions pingOptions = new PingOptions();
                PingReply reply = myPing.Send(host, timeout, buffer, pingOptions);
                return (reply.Status == IPStatus.Success);
            }
            catch (Exception)
            {
                return false;
            }
        }



        private void ConnectionButtonClick(object sender, RoutedEventArgs e)
        {
            if (CheckForInternetConnection())
            {
                MessageBox.Show("Internet Connected !!");
            }
            else
                MessageBox.Show("Internet Failed !!");


        }

        private void CreateOnPdfButton_click(object sender, RoutedEventArgs e)
        {
            var list = GetNumberFromMongodb(new TypeNumbersClass() { pName = "ccr", pNumber = "456" },
                  5, 4312.ToString());
            BarcodeDocumentPdf oneBarcode = new BarcodeDocumentPdf("oneBarcode.pdf",
                iTextSharp.text.PageSize.A7);
            oneBarcode.Barcodes = list;
            oneBarcode.CreateA7BarcodeDocument();

        }


        public List<ProductBarcodeClass> GetNumberFromMongodb(TypeNumbersClass tNumber,
            int count, string containerNumber)
        {

            var mongoreader = new MongoConnection();

            //var ff = mongoreader.GetBarcodes("4312");
            var ff = mongoreader.FindProductsBy(containerNumber);

            var yy = ff[0].productNumbers.Cast<string>().ToList();

            //هنا عدد المنتجات اللازم طباعتها 
            var ProductNumbersByType = GetProductNumbersToPrint();

            //تحميل ملف الأنواع
            var typesNumbers = GetTypesNumbers();
            //الأرقام هنا من قاعدة البيانات 
            Stack<string> barcodeStack = new Stack<string>(yy);

            string typeNumber = tNumber.pNumber;

            List<ProductBarcodeClass> allCode = new List<ProductBarcodeClass>();

            for (int i = 0; i < count; i++)
            {
                string code = barcodeStack.Pop();
                allCode.Add(new ProductBarcodeClass()
                {
                    ImageCode = ff[0].containerNumber + code + typeNumber,
                    BarcodeLabel = ff[0].containerNumber + code + typeNumber,
                    ProductTypeRank = tNumber.pName

                });
            }
            return allCode;
        }

        private void ScannedContainerClick(object sender, RoutedEventArgs e)
        {
            MongoConnection scannedContainer = new MongoConnection();
            //var cNumber = scannedContainer.GetContainerNumber();
            scannedContainer.AddScannedProduct("8408", new List<string>() { "789456123", "789456123","789653412"});
        }
    }
    public class Types
    {
        public ObjectId _id { set; get; }
        public object[] types { set; get; }
    }

    internal class Student
    {
        public ObjectId _id { set; get; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Class { get; set; }
        public int Age { get; set; }
        public IEnumerable<string> Subjects { get; set; }
    }


}
