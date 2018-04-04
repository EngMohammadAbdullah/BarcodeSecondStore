using BarcodeClothesPrinter.Windows;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace BarcodeClothesPrinter
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private void OnApplicationStart(object sender, StartupEventArgs e)
        {
            // TestWindow window = new TestWindow();
            //ProductsNormalViewWindow window = new ProductsNormalViewWindow("8408");
            ProductTypeConfigurationWindow window = new ProductTypeConfigurationWindow();
            window.Show();
        }
    }
}
