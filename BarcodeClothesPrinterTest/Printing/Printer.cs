using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;

namespace BarcodeClothesPrinter.Printing
{
    /// &lt;summary>Provides printing capabilities.&lt;/summary>
    public static class Printer
    {
        /// &lt;summary>Prints the FrameworkElement.&lt;/summary>
        /// &lt;param name="fe">The FrameworkElement.&lt;/param>
        public static void Print(this FrameworkElement fe)
        {
            PrintDialog pd = new PrintDialog();

            bool? result = pd.ShowDialog();

            if (!result.HasValue || !result.Value) return;

            fe.Dispatcher.Invoke(new Action(() =>
            {
                fe.Measure(new Size(Double.PositiveInfinity, Double.PositiveInfinity));
                fe.Arrange(new Rect(fe.DesiredSize));
                fe.UpdateLayout();
            }), System.Windows.Threading.DispatcherPriority.Render);

            int height = (int)pd.PrintableAreaHeight;
            int width = (int)pd.PrintableAreaWidth;
            int pages = (int)Math.Ceiling((fe.ActualHeight / height));

            FixedDocument document = new FixedDocument();

            for (int i = 0; i < pages; i++)
            {
                FixedPage page = new FixedPage();
                page.Height = height;
                page.Width = width;

                PageContent content = new PageContent();
                content.Child = page;

                document.Pages.Add(content);

                VisualBrush vb = new VisualBrush(fe);
                vb.AlignmentX = AlignmentX.Left;
                vb.AlignmentY = AlignmentY.Top;
                vb.Stretch = Stretch.None;
                vb.TileMode = TileMode.None;
                vb.Viewbox = new Rect(0, i * height, width, (i + 1) * height);
                vb.ViewboxUnits = BrushMappingMode.Absolute;

                RenderOptions.SetBitmapScalingMode(vb, BitmapScalingMode.HighQuality);

                Canvas canvas = new Canvas();
                canvas.Background = vb;
                canvas.Height = height;
                canvas.Width = width;

                FixedPage.SetLeft(canvas, 0);
                FixedPage.SetTop(canvas, 0);

                page.Children.Add(canvas);
            }

            pd.PrintDocument(document.DocumentPaginator,
            ((String.IsNullOrWhiteSpace(fe.Name) ? "Temp" : fe.Name) + " PRINT"));
        }

        /// &lt;summary>Prints the FrameworkElement as a 
        /// continuous (no page breaks) print.&lt;/summary>
        /// &lt;param name="fe">The FrameworkElement.&lt;/param>
        public static void PrintContinuous(this FrameworkElement fe)
        {
            PrintDialog pd = new PrintDialog();

            bool? result = pd.ShowDialog();

            if (!result.HasValue || !result.Value) return;

            fe.Dispatcher.Invoke(new Action(() =>
            {
                fe.Measure(new Size(Double.PositiveInfinity, Double.PositiveInfinity));
                fe.Arrange(new Rect(fe.DesiredSize));
                fe.UpdateLayout();
            }), System.Windows.Threading.DispatcherPriority.Render);

            pd.PrintVisual(fe, ((String.IsNullOrWhiteSpace
            (fe.Name) ? "Temp" : fe.Name) + " PRINT"));
        }

        /// &lt;summary>Takes a one page snapshot 
        /// the FrameworkElement.&lt;/summary>
        /// &lt;param name="fe">The FrameworkElement.&lt;/param>
        public static void Snapshot(this FrameworkElement fe)
        {
            PrintDialog pd = new PrintDialog();

            bool? result = pd.ShowDialog();

            if (!result.HasValue || !result.Value) return;

            pd.PrintVisual(fe, ((String.IsNullOrWhiteSpace(fe.Name) ?
                "Temp" : fe.Name) + " PRINT"));
        }
    }
}
