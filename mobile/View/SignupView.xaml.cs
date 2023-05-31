using mobile.ViewModel;

namespace mobile.View;

public partial class SignupView : ContentPage
{
	public SignupView(SignupViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}
}