using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace BarcodeClothesPrinter.Converters
{

    [ValueConversion(typeof(DateTime), typeof(string))]
    class ToShortDate : IValueConverter
    {
        public object Convert(object value, Type targetType,
            object parameter, CultureInfo culture)
        {

            return (DateTime.Parse(value.ToString()).ToShortDateString());

        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return null;
        }
    }
}
