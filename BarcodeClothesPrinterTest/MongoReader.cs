using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver.Linq;
using BarcodeClothesPrinter.Classes;

namespace BarcodeClothesPrinter
{
    public class MongoReader
    {
        string connectionString =
                "mongodb://eng_mohammad:mohammad224@ds123312.mlab.com:23312/barcode_clothes";
        MongoClient client;
        IMongoDatabase db;
        public MongoReader()
        {
            client = new MongoClient(connectionString);
            db = client.GetDatabase("barcode_clothes");
        }

        public async Task<List<ProductClass>> GetBarcodes(string containerNumber)
        {


            var collection = db.GetCollection<ProductClass>("product");


            var temp = collection.Find(product => product.containerNumber == containerNumber)
                .ToList<ProductClass>();



            return temp;


        }





        public async void UpdateProductCollection(string containerNumber ,
            string [] containerNums)
        {

            var collection = db.GetCollection<ProductClass>("product");


            var temp = collection.Find(product => product.containerNumber == containerNumber)
                .ToList<ProductClass>();

            temp[0].productNumbers = containerNums;
            var update = Builders<ProductClass>.Update.Set("productNumbers", containerNums);
            collection.UpdateOne<ProductClass>(product => product.containerNumber == containerNumber,
                update);
        }

    }


  

}

