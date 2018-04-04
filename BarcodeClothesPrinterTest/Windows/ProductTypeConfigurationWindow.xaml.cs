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
    /// Interaction logic for ProductTypeConfigurationWindow.xaml
    /// </summary>
    public partial class ProductTypeConfigurationWindow : Window
    {
        ObservableCollection<TypeNumbersClass> ob;
        MongoConnection mongo = new MongoConnection();
        List<string> allNumbers;
        Stack<string> queNumbers;

        public ProductTypeConfigurationWindow()
        {
            InitializeComponent();

            IEnumerable<TypeNumbersClass> source;
            source = mongo.GetProductTypes();

            ob = new ObservableCollection<TypeNumbersClass>(source);
            RemoveExistingNumbers();
            ListView1.ItemsSource = ob;
            cbxTypeDegrees.ItemsSource = mongo.GetProductDegrees();

        }

        void RemoveExistingNumbers()
        {

            allNumbers = new List<string>();

            for (int i = 10; i < 100; i++)
            {
                allNumbers.Add(i.ToString());
            } 

          

            foreach (TypeNumbersClass number in ob)
            {

                allNumbers.Remove(number.pNumber);
            }

            queNumbers = new Stack<string>(allNumbers);

        }

        string SetProductNumber()
        {

            return queNumbers.Pop();
        }


        private void ButtonShudown_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }


        private void Grid_MouseDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }



        private void SaveDiskClick(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(tblkName.Text))
                return;
            if (cbxTypeDegrees.SelectedItem == null)
            {
                return;
            }

            if (ob.Select(n => n.pName).Any(n => n == tblkName.Text.Trim()))
            {
                MessageWindows w = new MessageWindows();
                w.Owner = this;
                w.Show("Duplicated", "Type Existing !!");

                return;
            }

            ob.Add(new TypeNumbersClass()
            {
                pName = tblkName.Text,
                pNumber = SetProductNumber() + (cbxTypeDegrees.SelectedItem as TypeNumbersClass)
                .pNumber.ToString()
            });
            tblkName.Clear();
        }


        private void SaveCloudeClick(object sender, RoutedEventArgs e)
        {

            mongo.SaveNewTypes(ob);
            MessageWindows w = new MessageWindows();
            w.Owner = this;
            w.Show("Success", "تم بنجاح ");
        }

        private void ComboBox_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            new TypeDegrees().ShowDialog();
            cbxTypeDegrees.ItemsSource = mongo.GetProductDegrees();

        }



        private void DeleteItemClick(object sender, RoutedEventArgs e)
        {
            TypeNumbersClass item = ListView1.SelectedItem as TypeNumbersClass;
            if (item == null)
            {
                return;
            }

            ob.Remove(item);


        }
    }
}
