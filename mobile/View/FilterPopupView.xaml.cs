using CommunityToolkit.Maui.Views;
using Newtonsoft.Json.Linq;

namespace mobile.View;

public partial class FilterPopupView : Popup
{
	JObject obj;
	public FilterPopupView(JObject obj)
	{
		InitializeComponent();
		this.obj = obj;
	}

    private void Button_Clicked(object sender, EventArgs e)
    {
		int min_price = 0;
		int max_price = 0;

		int.TryParse(min_price_entry.Text, out min_price);
		int.TryParse(max_price_entry.Text, out max_price);

		obj.Add("orderByTotalPrice", orderByPriceCheckBox.IsChecked);
        obj.Add("orderByCount", orderByCountCheckBox.IsChecked);
        obj.Add("min_price", min_price);
		obj.Add("max_price", max_price);


		Close();
    }
}