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
using System.Windows.Threading;

namespace BarcodeClothesPrinter.Windows
{
    /// <summary>
    /// Interaction logic for MessageWindows.xaml
    /// </summary>
    public partial class MessageWindows : Window
    {
        public MessageWindows()
        {
            InitializeComponent();
        }



        //public string MessageTitle
        //{
        //    get { return (string)this.GetValue(MessageTitleProperty); }
        //    set { this.SetValue(MessageTitleProperty, value); }
        //}
        //public static readonly DependencyProperty MessageTitleProperty =
        //    DependencyProperty.Register(
        //  "MessageTitle", typeof(string), typeof(TextBlock), new PropertyMetadata(false));

        private void ButtonShudown_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

      
        public void Show(string messageTitle, string messageBody)
        {
            tblkTitle.Text = messageTitle;
            tblkBody.Text = messageBody;
            this.ShowDialog();
        }



    }
}
