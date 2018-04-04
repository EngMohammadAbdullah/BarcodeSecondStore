using BarcodeClothesPrinter.Classes;
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
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace BarcodeClothesPrinter.Windows
{
    /// <summary>
    /// Interaction logic for ProductsWindow.xaml
    /// </summary>
    public partial class ProductsWindow : Window
    {

        public ObservableCollection<ImageProductList> AllScannedProducts;


        public string ContainerDate { get; set; }
        public string ContainerNumber { get; set; }

        MongoConnection mongoProducts;

        public ProductsWindow(string _ContainerNumber)
        {
            this.ContainerNumber = _ContainerNumber;
            InitializeComponent();

            mongoProducts = new MongoConnection();
            this.DataContext = this;
        }
        public ProductsWindow()
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

            //     txtBlockContainerNumber.Text = ContainerNumber;

            txtBolockContainerDate.Text =
                mongoProducts.GetContainerDate(ContainerNumber).ToShortDateString();

            this.dataTemplate.ItemsSource = AllScannedProducts;

        }


    }


}
