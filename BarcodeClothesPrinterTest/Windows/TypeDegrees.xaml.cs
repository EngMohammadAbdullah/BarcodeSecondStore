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
    /// Interaction logic for TypeDegrees.xaml
    /// </summary>
    public partial class TypeDegrees : Window
    {

        ObservableCollection<TypeNumbersClass> ob;

        MongoConnection mongo = new MongoConnection();

        List<string> allNumbers;

        Stack<string> queNumbers;

        public TypeDegrees()
        {
            InitializeComponent();
            IEnumerable<TypeNumbersClass> source;
            source = mongo.GetProductDegrees();

            ob = new ObservableCollection<TypeNumbersClass>(source);
            RemoveExistingNumbers();
            ListView1.ItemsSource = ob;
        }

        void RemoveExistingNumbers()
        {

            allNumbers = new List<string>();

            for (int i = 1; i < 10; i++)
            {
                allNumbers.Add(i.ToString());
            }
           allNumbers.Reverse();


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

        private void StackPanel_MouseDown(object sender, MouseButtonEventArgs e)
        {
            this.DragMove();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(tblkName.Text))
                return;

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
                pNumber = SetProductNumber()
            });
            tblkName.Clear();
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            mongo.SaveNewProductDegrees(ob);
            MessageWindows w = new MessageWindows();
            w.Owner = this;
            w.Show("Success", "تم بنجاح ");
        }
    }
}
