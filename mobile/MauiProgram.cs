using CommunityToolkit.Maui;
using Microsoft.Extensions.Logging;
using mobile.View;
using mobile.ViewModel;

namespace mobile;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.UseMauiCommunityToolkit()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

        builder.Services.AddSingleton<IConnectivity>(Connectivity.Current);


		builder.Services.AddSingleton<AppShell>();
		builder.Services.AddSingleton<AppShellViewModel>();

		builder.Services.AddTransient<LoadingView>();
        builder.Services.AddTransient<LoadingViewModel>();

        builder.Services.AddSingleton<LoginView>();
		builder.Services.AddSingleton<LoginViewModel>();

		builder.Services.AddSingleton<SignupView>();
		builder.Services.AddSingleton<SignupViewModel>();

		builder.Services.AddSingleton<MainView>();
		builder.Services.AddSingleton<MainViewModel>();

		builder.Services.AddTransient<DetailsView>();
		builder.Services.AddTransient<DetailsViewModel>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
