using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace BarcodeClothesPrinter.Converters
{

    [ValueConversion(typeof(string), typeof(string))]
    class ProductTypeToImageUrl : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {

            string projectPath = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.FullName;

            var imagePath = string.Format("{0}\\Images\\{1}.png", projectPath,value);

            return imagePath;

        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}
