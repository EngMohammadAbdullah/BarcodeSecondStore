using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BarcodeClothesPrinter.Classes
{
    public class ProductTypeClass
    {
        public ObjectId _id { set; get; }
        public TypeNumbersClass[] types { set; get; }
    }
}
