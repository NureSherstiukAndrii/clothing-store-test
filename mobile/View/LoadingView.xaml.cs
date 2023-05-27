using Flurl.Http;
using mobile.ViewModel;

namespace mobile.View;

public partial class LoadingView : ContentPage
{
	public LoadingView(LoadingViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
		viewModel.CheckAuthorization();
    }
}