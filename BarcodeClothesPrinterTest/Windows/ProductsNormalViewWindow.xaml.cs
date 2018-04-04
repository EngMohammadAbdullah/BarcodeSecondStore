using BarcodeClothesPrinter.Classes;
using BarcodeClothesPrinter.Printing;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace BarcodeClothesPrinter.Windows
{
    /// <summary>
    /// Interaction logic for ProductsWindow.xaml
    /// </summary>
    public partial class ProductsNormalViewWindow : Window
    {

        public ObservableCollection<ImageProductList> AllScannedProducts;


        public string ContainerDate { get; set; }
        public string ContainerNumber { get; set; }
        public ObservableCollection<ImageProductList> LeftItems;
        public ObservableCollection<ImageProductList> RightItems;

        MongoConnection mongoProducts;

        public ProductsNormalViewWindow(string _ContainerNumber)
        {
            this.ContainerNumber = _ContainerNumber;
            InitializeComponent();

            mongoProducts = new MongoConnection();
            this.DataContext = this;
        }
        public ProductsNormalViewWindow()
        {

            InitializeComponent();

            mongoProducts = new MongoConnection();
            this.DataContext = this;
        }



        private void Grid_MouseDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }

        private void ButtonShudown_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {

            LoadProducts();


        }

        public async void LoadProducts()
        {


            Task<IEnumerable<ImageProductList>> x =

             mongoProducts.GetImageScannedProducts(ContainerNumber);

            x.Wait();

            AllScannedProducts =
                new ObservableCollection<ImageProductList>(
                                    x.Result);

            //LeftItems = new ObservableCollection<ImageProductList>();
            //RightItems = new ObservableCollection<ImageProductList>();
            //for (int i = 0; i < AllScannedProducts.Count/2; i++)
            //{
            //    LeftItems.Add(AllScannedProducts[i]);


            //}
            //for (int i = AllScannedProducts.Count / 2; i < AllScannedProducts.Count ; i++)
            //{
            //    RightItems.Add(AllScannedProducts[i]);

            //}



            //txtBlockContainerNumber.Text = ContainerNumber;

            txtBolockContainerDate.Text =
                mongoProducts.GetContainerDate(ContainerNumber).ToShortDateString();

            // this.dataTemplate.ItemsSource = AllScannedProducts;

            AddBorderToListBox();

        }

        private void AddBorderToListBox()
        {
            foreach (var item in AllScannedProducts)
            {
                StackPanel stack = GetStackPanel();
                stack.Children.Add(GetTextBlock(item.Name));
                int ProductCount = int.Parse(item.ProductNumber);
                int sixCount = ProductCount / 6;
                ProductCount -= (ProductCount / 6) * 6;
                int fiveCount = ProductCount / 5;
                ProductCount -= (ProductCount / 5) * 5;

                for (int i = 0; i < sixCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, true));
                }
                for (int i = 0; i < fiveCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, false));

                }

                stack.Children.Add(GetFullRectangle(ProductCount, false, false));

                dataTemplate.Items.Add(stack);

            }
            foreach (var item in AllScannedProducts)
            {
                StackPanel stack = GetStackPanel();
                stack.Children.Add(GetTextBlock(item.Name));
                int ProductCount = int.Parse(item.ProductNumber);
                int sixCount = ProductCount / 6;
                ProductCount -= (ProductCount / 6) * 6;
                int fiveCount = ProductCount / 5;
                ProductCount -= (ProductCount / 5) * 5;

                for (int i = 0; i < sixCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, true));
                }
                for (int i = 0; i < fiveCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, false));

                }

                stack.Children.Add(GetFullRectangle(ProductCount, false, false));

                dataTemplate.Items.Add(stack);

            }
            foreach (var item in AllScannedProducts)
            {
                StackPanel stack = GetStackPanel();
                stack.Children.Add(GetTextBlock(item.Name));
                int ProductCount = int.Parse(item.ProductNumber);
                int sixCount = ProductCount / 6;
                ProductCount -= (ProductCount / 6) * 6;
                int fiveCount = ProductCount / 5;
                ProductCount -= (ProductCount / 5) * 5;

                for (int i = 0; i < sixCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, true));
                }
                for (int i = 0; i < fiveCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, false));

                }

                stack.Children.Add(GetFullRectangle(ProductCount, false, false));

                dataTemplate.Items.Add(stack);

            }
            foreach (var item in AllScannedProducts)
            {
                StackPanel stack = GetStackPanel();
                stack.Children.Add(GetTextBlock(item.Name));
                int ProductCount = int.Parse(item.ProductNumber);
                int sixCount = ProductCount / 6;
                ProductCount -= (ProductCount / 6) * 6;
                int fiveCount = ProductCount / 5;
                ProductCount -= (ProductCount / 5) * 5;

                for (int i = 0; i < sixCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, true));
                }
                for (int i = 0; i < fiveCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, false));

                }

                stack.Children.Add(GetFullRectangle(ProductCount, false, false));

                dataTemplate.Items.Add(stack);

            }
            foreach (var item in AllScannedProducts)
            {
                StackPanel stack = GetStackPanel();
                stack.Children.Add(GetTextBlock(item.Name));
                int ProductCount = int.Parse(item.ProductNumber);
                int sixCount = ProductCount / 6;
                ProductCount -= (ProductCount / 6) * 6;
                int fiveCount = ProductCount / 5;
                ProductCount -= (ProductCount / 5) * 5;

                for (int i = 0; i < sixCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, true));
                }
                for (int i = 0; i < fiveCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, false));

                }

                stack.Children.Add(GetFullRectangle(ProductCount, false, false));

                dataTemplate.Items.Add(stack);

            }
            foreach (var item in AllScannedProducts)
            {
                StackPanel stack = GetStackPanel();
                stack.Children.Add(GetTextBlock(item.Name));
                int ProductCount = int.Parse(item.ProductNumber);
                int sixCount = ProductCount / 6;
                ProductCount -= (ProductCount / 6) * 6;
                int fiveCount = ProductCount / 5;
                ProductCount -= (ProductCount / 5) * 5;

                for (int i = 0; i < sixCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, true));
                }
                for (int i = 0; i < fiveCount; i++)
                {
                    stack.Children.Add(GetFullRectangle(4, true, false));

                }

                stack.Children.Add(GetFullRectangle(ProductCount, false, false));

                dataTemplate.Items.Add(stack);

            }

        }

        private UIElement GetFullRectangle(int borders, bool firstLineStroked, bool secondLineStroked)
        {
            return GetBorder(borders, GetCanvas(GetFirstLine(firstLineStroked),
                 GetSecondLine(secondLineStroked)));
        }

        private childItem FindVisualChild<childItem>(DependencyObject obj)
    where childItem : DependencyObject
        {
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(obj); i++)
            {
                DependencyObject child = VisualTreeHelper.GetChild(obj, i);
                if (child != null && child is childItem)
                    return (childItem)child;
                else
                {
                    childItem childOfChild = FindVisualChild<childItem>(child);
                    if (childOfChild != null)
                        return childOfChild;
                }
            }
            return null;
        }

        private Border GetBorder(int strokedNumber, Canvas canvas)
        {
            Border border = new Border()
            {
                BorderBrush = Brushes.Black,
                Width = 35,
                Height = 35,
                Margin = new Thickness(10, 0, 10, 0)
            };

            switch (strokedNumber)
            {
                case 1:
                    border.BorderThickness = new Thickness(4, 0, 0, 0);
                    break;
                case 2:
                    border.BorderThickness = new Thickness(4, 4, 0, 0);
                    break;
                case 3:
                    border.BorderThickness = new Thickness(4, 4, 0, 4);
                    break;
                case 4:
                    border.BorderThickness = new Thickness(4);
                    break;

            }
            border.Child = canvas;
            return border;

        }

        Canvas GetCanvas(Line firstLine, Line SecondLine)
        {

            Canvas canvas = new Canvas();
            canvas.Children.Add(firstLine);
            canvas.Children.Add(SecondLine);
            return canvas;
        }

        private Line GetFirstLine(bool Stroked)
        {

            // Add a Line Element
            Line myLine = new Line();
            if (Stroked)
                myLine.Stroke = System.Windows.Media.Brushes.Black;
            else
                myLine.Stroke = System.Windows.Media.Brushes.Transparent;

            myLine.X1 = 0;
            myLine.X2 = 30;
            myLine.Y1 = 0;
            myLine.Y2 = 30;
            myLine.StrokeThickness = 4;

            return myLine;
        }

        private Line GetSecondLine(bool Stroked)
        {

            // Add a Line Element
            Line myLine = new Line();
            if (Stroked)
                myLine.Stroke = System.Windows.Media.Brushes.Black;
            else
                myLine.Stroke = System.Windows.Media.Brushes.Transparent;

            myLine.X1 = 30;
            myLine.X2 = -2;
            myLine.Y1 = -3;
            myLine.Y2 = 30;

            myLine.StrokeThickness = 4;

            return myLine;
        }
        private StackPanel GetStackPanel()
        {

            StackPanel stackpanel = new StackPanel()
            {
                Orientation = Orientation.Horizontal,
                Margin = new Thickness(40, 20, 30, 0)
            };
            return stackpanel;

        }
        private TextBlock GetTextBlock(string content)
        {
            TextBlock listBox = new TextBlock()
            {
                Text = content.ToUpper(),
                Effect = new DropShadowEffect()
                {
                    BlurRadius = 20,
                    RenderingBias = RenderingBias.Quality,
                    Color = Colors.Black
                },
                //Margin = new Thickness(10,0,10,15),
                FontFamily = new FontFamily("Impact"),
                FontSize = 18,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center

            };
            return listBox;

        }

        private void PrintClick(object sender, RoutedEventArgs e)
        {
            dataTemplate.Print();
        }
    }



}
