using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BarcodeClothesPrinter.Classes
{
    public class ContainerNumbers
    {

        public ObjectId _id { get; set; }
        public string[] container_number { get; set; }

        public int __v { get; set; }

    }
}
