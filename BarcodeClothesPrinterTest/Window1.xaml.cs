using BarcodeClothesPrinter.Classes;
using BarcodeClothesPrinter.Windows;
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

namespace BarcodeClothesPrinter
{
    /// <summary>
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class Window1 : Window
    {
        public Window1()
        {
            InitializeComponent();
        }



        private void ButtonShudown_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void GridTitle_MouseDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }

        private void NewScannedProducts(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("New Scanned Products");
        }

        private void OpenProducts(object sender, MouseButtonEventArgs e)
        {
            MessageBox.Show(e.Source.GetType().ToString());
        }

        private void OpenScannedProductsButtonClick(object sender, RoutedEventArgs e)
        {
            ProductsWindow productsWindow = new ProductsWindow();

            productsWindow.ContainerNumber = "8408";

            productsWindow.ShowDialog();
        }
    }
}
