using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BarcodeClothesPrinter.Classes
{
    
    public class ScannedContainer
    {

        public ObjectId _id { get; set; }
        public string ContainerNumber { get; set; }
        public string[] ScannedProducts { get; set; }
        public DateTime ContainerDate { get; set; }

    }
}
