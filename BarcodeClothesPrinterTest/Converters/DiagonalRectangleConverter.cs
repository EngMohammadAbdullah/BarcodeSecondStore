using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Data;

namespace BarcodeClothesPrinter.Converters
{

    [ValueConversion(typeof(Border), typeof(double))]
    class DiagonalRectangleConverter : IValueConverter
    {
        public object Convert(object value, Type targetType,
            object parameter, CultureInfo culture)
        {

            double dd = Math.Sqrt(Math.Pow((value as Border).Height,2) + 
               Math.Pow((value as Border).Width, 2));

            return dd;

            
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}
