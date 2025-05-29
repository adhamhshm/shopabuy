namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = [];

    public void AddItem(Product product, int quantity)
    {
        // defensive checks
        if (product == null) ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0) throw new ArgumentException("Quantity should be greater than zero.", nameof(quantity));

        // get the product
        var existingItem = FindItem(product.Id);

        // if null add as new item
        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                Product = product,
                Quantity = quantity
            });
        }
        // if not null add the existing quantity
        else
        {
            existingItem.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity should be greater than zero.", nameof(quantity));

        // get the product
        var item = FindItem(productId);
        // if null just return, dont do anything
        if (item == null) return;
        // if product exist, minus the quantity
        item.Quantity -= quantity;
        // if product quantity already <= 0, remove the product
        if (item.Quantity <= 0) Items.Remove(item);
    }

    private BasketItem? FindItem(int productId)
    {
        return Items.FirstOrDefault(item => item.ProductId == productId);
    }
}
