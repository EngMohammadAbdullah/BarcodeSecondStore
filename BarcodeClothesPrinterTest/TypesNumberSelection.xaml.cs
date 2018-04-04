using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
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
    /// Interaction logic for TypesNumberSelection.xaml
    /// </summary>
    public partial class TypesNumberSelection : Window
    {
        List<ProductCount> productCountConfig;

        IEnumerable<TextBox> collection;

        public TypesNumberSelection()
        {
            InitializeComponent();
            collection = FindLogicalChildren<TextBox>(this);

            foreach (TextBox item in collection)
            {
                item.TextChanged += Item_TextChanged;
            }

            productCountConfig = new List<ProductCount>();
            if (File.Exists("config_product_names.json"))
            {

                var obj = JsonConvert.DeserializeObject< List<ProductCount>>(File.ReadAllText("config_product_names.json"));


                foreach (ProductCount pcount in obj)
                {
                    var textBox = collection.Where(t => t.Name == pcount.ProductName)
                        .SingleOrDefault();
                    textBox.Text = pcount.PCount.ToString();
                }
               
            }
            
        }

        private void Item_TextChanged(object sender, TextChangedEventArgs e)
        {
            TextBox tbox = (sender as TextBox);
            tbox.Foreground = Brushes.Green;
        }

        public IEnumerable<T> FindLogicalChildren<T>(DependencyObject depObj) where T : DependencyObject
        {
            if (depObj != null)
            {
                foreach (object rawChild in LogicalTreeHelper.GetChildren(depObj))
                {
                    if (rawChild is DependencyObject)
                    {
                        DependencyObject child = (DependencyObject)rawChild;
                        if (child is T)
                        {
                            yield return (T)child;
                        }

                        foreach (T childOfChild in FindLogicalChildren<T>(child))
                        {
                            yield return childOfChild;
                        }
                    }
                }
            }
        }


        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {

        }

        private void save_file(object sender, RoutedEventArgs e)
        {
            foreach (TextBox textBox in collection)
            {
                productCountConfig.Add(new ProductCount()
                {
                    ProductName = textBox.Name,
                    PCount = int.Parse(textBox.Text)
                });
            }

            var json = JsonConvert.SerializeObject(productCountConfig);

            File.WriteAllText("config_product_names.json", json);
            MessageBox.Show("تم الحفظ");
        }
    }

    public class ProductCount
    {
        public string ProductName { get; set; }
        public int PCount { get; set; }

    }
}
