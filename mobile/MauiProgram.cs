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
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

        builder.Services.AddSingleton<IConnectivity>(Connectivity.Current);

		builder.Services.AddSingleton<LoadingView>();
        builder.Services.AddSingleton<LoadingViewModel>();

        builder.Services.AddSingleton<LoginView>();
		builder.Services.AddSingleton<LoginViewModel>();

		builder.Services.AddSingleton<MainView>();
		builder.Services.AddSingleton<MainViewModel>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
