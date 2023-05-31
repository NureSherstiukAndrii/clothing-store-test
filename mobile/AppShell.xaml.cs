using mobile.View;
using mobile.ViewModel;

namespace mobile;

public partial class AppShell : Shell
{
	public AppShell(AppShellViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;

		Routing.RegisterRoute(nameof(DetailsView), typeof(DetailsView));
	}
}
