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
using BarcodeClothesPrinter.Printing;

namespace BarcodeClothesPrinter.Windows
{
    /// <summary>
    /// Interaction logic for TestWindow.xaml
    /// </summary>
    public partial class TestWindow : Window
    {
        public Person obj { get; set; }

        public TestWindow()
        {
            InitializeComponent();
            obj = new Person();
            obj.Name = "Hello I am obj";
            this.DataContext = this;
        }

        private void PrintClick(object sender, RoutedEventArgs e)
        {
            (grid as FrameworkElement).Print();
        }
    }
    public class Person
    {
        public string Name { get; set; }

    }

 
}
