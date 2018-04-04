using BarcodeClothesPrinter.Classes;
using System;
using System.Collections.Generic;
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
    /// Interaction logic for Containers.xaml
    /// </summary>
    public partial class Containers : Window
    {
        MongoConnection mongo = new MongoConnection();
        public Containers()
        {
            InitializeComponent();
        }

        private void ButtonShudown_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            var x = mongo.GetAllScannedContainers();


            dataTemplate.ItemsSource = x.Result;
        }

        private void StackPanel_MouseDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }





        private void dataTemplate_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (dataTemplate.SelectedItem == null)
                return;
            string productNumber = (dataTemplate.SelectedItem as ScannedContainer)
                                 .ContainerNumber;

            ProductsNormalViewWindow window =
                 new ProductsNormalViewWindow(productNumber);
            window.ShowDialog();
        }

       

        private void dataTemplate_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (dataTemplate.SelectedItem == null)
                return;
          
            string productNumber = (dataTemplate.SelectedItem as ScannedContainer)
                                 .ContainerNumber;

            ProductsNormalViewWindow window =
                 new ProductsNormalViewWindow(productNumber);
            window.ShowDialog();
        }
    }
}
