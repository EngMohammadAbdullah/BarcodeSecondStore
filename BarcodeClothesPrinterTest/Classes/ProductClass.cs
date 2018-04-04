using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BarcodeClothesPrinter.Classes
{
    public  class ProductClass
    {
        public ObjectId _id { set; get; }
        public string[] productNumbers { set; get; }

        public string containerNumber { set; get; }
        public int __v { set; get; }
    }
}
