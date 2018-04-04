using BarcodeClothesPrinter.Classes;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BarcodeClothesPrinter
{
    public class ProductTypes
    {
        string connectionString =
               "mongodb://eng_mohammad:mohammad224@ds123312.mlab.com:23312/barcode_clothes";
        MongoClient client;
        IMongoDatabase db;
        public ProductTypes()
        {
            client = new MongoClient(connectionString);
            db = client.GetDatabase("barcode_clothes");
        }


        public IEnumerable<TypeNumbersClass> GetProductTypes()
        {

            try
            {

                List<TypeNumbersClass> typesAndNumbers = new List<TypeNumbersClass>();
                var collection = db.GetCollection<ProductTypeClass>("Types");

                var temp = collection.Find(Builders<ProductTypeClass>.Filter.Empty).
                    ToList<ProductTypeClass>();
                foreach (var item in temp.First().TypesList.ToArray())
                {
                    typesAndNumbers.Add(new TypeNumbersClass() {
                        pName = item.ToBsonDocument().First().Name , 
                        pNumber = item.ToBsonDocument().First().Value.ToString()
                    });
                }
                return typesAndNumbers;
            }
            catch (Exception e)
            {

                throw;
            }


        }

    }


}
