using mobile.ViewModel;

namespace mobile.View;

public partial class DetailsView : ContentPage
{
	public DetailsView(DetailsViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}
}