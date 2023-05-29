using mobile.ViewModel;

namespace mobile.View;

public partial class MainView : ContentPage
{
	public MainView(MainViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}
}

