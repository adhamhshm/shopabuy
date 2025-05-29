using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

// add a name convention for the table name when we creating its migrations
[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }

    // Navigation properties for this class
    public int ProductId { get; set; }
    public required Product Product { get; set; }

    // we alraedy specify the relation one to many for "Basket" -> "BasketItem"
    // here we specify again the relation one item "BasketItem" belong to one "Basket" 
    public int BasketId { get; set; }
    public Basket Basket { get; set; } = null!;
}