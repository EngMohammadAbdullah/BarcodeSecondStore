using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;

namespace BarcodeClothesPrinter.Classes
{
    public class MongoConnection
    {

        public string connectionString =
                  "mongodb://eng_mohammad:mohammad224@ds123312.mlab.com:23312/barcode_clothes";
        public MongoClient client;
        IMongoDatabase db;
        public MongoConnection()
        {
            client = new MongoClient(connectionString);
            db = client.GetDatabase("barcode_clothes");
        }

        #region ProductCollection
        public IMongoCollection<ProductClass> ProductCollection()
        {


            return db.GetCollection<ProductClass>("product");

        }

        /// <summary>
        /// Get All  container products
        /// </summary>
        /// <param name="containerNumber">رقم الكونتير</param>
        /// <returns></returns>

        public List<ProductClass> FindProductsBy(string containerNumber)
        {


            return ProductCollection().Find(product => product.containerNumber == containerNumber)
                  .ToList<ProductClass>();

        }

        public void UpdateProductCollection(string containerNumber,
        string[] containerNums)
        {
            var finedProducts = FindProductsBy(containerNumber);

            finedProducts[0].productNumbers = containerNums;
            var update = Builders<ProductClass>.Update.Set("productNumbers", containerNums);
            ProductCollection().UpdateOne<ProductClass>(product => product.containerNumber == containerNumber,
                update);

        }

        #endregion



        #region ProductTypes

        public IEnumerable<TypeNumbersClass> GetProductTypes()
        {
            try
            {

                List<TypeNumbersClass> typesAndNumbers = 
                    new List<TypeNumbersClass>();
                var collection = db.GetCollection<ProductTypeClass>("Types");

                var temp = collection.Find(Builders<ProductTypeClass>.Filter.Empty).
                    ToList<ProductTypeClass>();
                if (temp.Count == 0)
                {
                    collection.InsertOne(new ProductTypeClass() { });
                    return typesAndNumbers;
                }

                if (temp.First().types == null)
                {
                    return typesAndNumbers;
                }

                foreach (var item in temp.First().types)
                {
                    typesAndNumbers.Add(new TypeNumbersClass()
                    {
                        pName = item.ToBsonDocument()["pName"].ToString(),
                        pNumber = item.ToBsonDocument()["pNumber"].ToString()
                    });
                }
                return typesAndNumbers;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void SaveNewTypes(ObservableCollection<TypeNumbersClass> ob)
        {


            var collection = db.GetCollection<ProductTypeClass>("Types");


            var document = collection.
                Find(Builders<ProductTypeClass>.Filter.Empty).ToList()[0];

            document.types = ob.ToArray();

            var update = Builders<ProductTypeClass>.Update.Set("types",
                ob.ToArray());

            collection.UpdateOne(FilterDefinition<ProductTypeClass>.Empty, update);

        }

        #endregion



        #region ScannedContainer
        public IMongoCollection<ScannedContainer> GetCurrentContainerCollection()
        {

            return db.GetCollection<ScannedContainer>("ScannedContainer");
        }

        public ScannedContainer GetCurrentContainer()
        {
            var scannedContainer = GetCurrentContainerCollection();
            var lastContainer =
                 scannedContainer.Find(Builders<ScannedContainer>.Filter.Empty).ToList().Last();
            return lastContainer;
        }

        public string GetCurrentContainerNumber()
        {

            return GetCurrentContainer().ContainerNumber;
        }

        public List<string> GetCurrentScannedProduct()
        {

            var scannedContainer = GetCurrentContainerCollection();
            var lastContainer =
                 scannedContainer.Find(Builders<ScannedContainer>.Filter.Empty)
                .ToList().Last();



            if (lastContainer.ScannedProducts == null)

                return new List<string>();

            else
                return lastContainer.ScannedProducts.ToList<string>();

        }

        public bool AllowedToAddNewConianer()
        {

            return GetCurrentScannedProduct().Count() > 400;

        }

        public void AddScannedProduct(string containerNumber, List<string> scannedProducts)
        {
            var allScannedProduct = GetCurrentScannedProduct();
            allScannedProduct.AddRange(scannedProducts);

            var update = Builders<ScannedContainer>.Update.Set("ScannedProducts", allScannedProduct.ToArray()
                );

            GetCurrentContainerCollection().UpdateOne<ScannedContainer>(product =>
            product.ContainerNumber == containerNumber, update);

        }

        public void AddScannedContainerCollection(string containerNumber)
        {
            GetCurrentContainerCollection().InsertOne(new ScannedContainer()
            {

                ContainerDate = DateTime.Now,
                ContainerNumber = containerNumber
            });
        }

        public DateTime GetContainerDate(string containerNumber)
        {
            var scannedContainer = GetCurrentContainerCollection();
            var lastContainer =
                 scannedContainer.Find(Builders<ScannedContainer>.Filter.Empty).ToList().Last();
            return lastContainer.ContainerDate;

        }

        public List<string> GetScannedProducts(string containerNumber)
        {
            var scannedContainer = GetCurrentContainerCollection();

            var lastContainer =
                 scannedContainer.Find(container => container.ContainerNumber == containerNumber)
                 .ToList().Last();
            if (lastContainer.ScannedProducts == null)
                return new List<string>();

            else
                return lastContainer.ScannedProducts.ToList<string>();


        }

        public async Task<IEnumerable<ImageProductList>> GetImageScannedProducts(string containerNumber)
        {
            IEnumerable<TypeNumbersClass> alltypes = GetProductTypes();

            List<ImageProductList> temp = new List<ImageProductList>();
            var scannedContainer = GetCurrentContainerCollection();
            //var lastContainer =
            //     scannedContainer.Find(container => container.ContainerNumber == containerNumber)
            //     .ToList().Last();

            //    var lastContainer =
            //await scannedContainer.FindAsync(Builders<ScannedContainer>.Filter.Empty)
            //;



            FilterDefinition<ScannedContainer> filter =
                FilterDefinition<ScannedContainer>.Empty;
            //FindOptions<ScannedContainer> options = new FindOptions<ScannedContainer>
            //{
            //    BatchSize = 2,
            //    NoCursorTimeout = false
            //};

            IEnumerable<ScannedContainer> lastContainer;

            lastContainer = await scannedContainer.FindAsync(filter).Result.ToListAsync();


            //using (IAsyncCursor<ScannedContainer> cursor =
            //    await scannedContainer.FindAsync(filter))

            //{


            //    lastContainer = await cursor.ToListAsync();

            //    if (lastContainer.Last<ScannedContainer>().ScannedProducts == null)

            //        return temp;





            //}

            foreach (string item in lastContainer.Last<ScannedContainer>()
                .ScannedProducts)
            {
                string productName = GetTypeName(item.Substring(9, 3), alltypes);

                temp.Add(new ImageProductList() { Name = productName });
            }



            List<ImageProductList> temp1 = new List<ImageProductList>();
            foreach (ImageProductList item in temp)
            {
                item.ProductNumber = temp.Where(p => p.Name == item.Name)
                    .Count().ToString();
                if (!temp1.Any(p => p.Name == item.Name))
                {
                    temp1.Add(item);
                }
            }


            return temp1;
        }

        private string GetTypeName(string item, IEnumerable<TypeNumbersClass> alltypes)
        {
            return alltypes.Where(t => t.pNumber == item).First().pName;
        }

        public async Task<IEnumerable<ScannedContainer>> GetAllScannedContainers()
        {
            var collection = GetCurrentContainerCollection();

            FilterDefinition<ScannedContainer> filter =

              FilterDefinition<ScannedContainer>.Empty;

            return await collection.FindAsync(filter).Result.ToListAsync();

        }

        #endregion


        #region ContainerNumbersCollection

        public IMongoCollection<ContainerNumbers> GetContainerNumbersCollection()
        {

            return db.GetCollection<ContainerNumbers>("Container");

        }

        public string GetContainerNumber()
        {

            List<string> containerNumbersList = new List<string>();
            Stack<string> containerNumberStack = new Stack<string>(
            GetContainerNumbersCollection().Find(Builders<ContainerNumbers>.Filter.Empty).ToList()[0]
                .container_number.Reverse().ToList());

            var containerNum = containerNumberStack.Pop();

            UpdateContainerNumberCollection(containerNumberStack.ToArray());
            return containerNum;

        }

        public void UpdateContainerNumberCollection(string[] containerNums)
        {
            var document = GetContainerNumbersCollection().
                Find(Builders<ContainerNumbers>.Filter.Empty).ToList()[0];

            document.container_number = containerNums;
            var update = Builders<ContainerNumbers>.Update.Set("container_number", containerNums);

            GetContainerNumbersCollection().UpdateOne(container => container._id == new ObjectId("5a4a7be8143fce3410f375f8"), update);

        }



        #endregion


        #region Product Degrees 

        public IEnumerable<TypeNumbersClass> GetProductDegrees()
        {
            try
            {

                List<TypeNumbersClass> typesAndNumbers =
                    new List<TypeNumbersClass>();
                var collection = db.GetCollection<ProductTypeClass>("ProductDegrees");

                var temp = collection.Find(Builders<ProductTypeClass>.Filter.Empty).
                    ToList<ProductTypeClass>();
                if (temp.Count == 0)
                {
                    collection.InsertOne(new ProductTypeClass() { });
                    return typesAndNumbers;
                }

                if (temp.First().types == null)
                {
                    return typesAndNumbers;
                }

                foreach (var item in temp.First().types)
                {
                    typesAndNumbers.Add(new TypeNumbersClass()
                    {
                        pName = item.ToBsonDocument()["pName"].ToString(),
                        pNumber = item.ToBsonDocument()["pNumber"].ToString()
                    });
                }
                return typesAndNumbers;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void SaveNewProductDegrees(ObservableCollection<TypeNumbersClass> ob)
        {


            var collection = db.GetCollection<ProductTypeClass>("ProductDegrees");


            var document = collection.
                Find(Builders<ProductTypeClass>.Filter.Empty).ToList()[0];

            document.types = ob.ToArray();

            var update = Builders<ProductTypeClass>.Update.Set("types",
                ob.ToArray());

            collection.UpdateOne(FilterDefinition<ProductTypeClass>.Empty, update);

        }

        #endregion




    }
}
