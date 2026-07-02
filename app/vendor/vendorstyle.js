import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#FFF7C0',
      },
      contentWrapper: {
        width: '100%',
        maxWidth: 600,
        alignItems: 'center',
      },
      vendorImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16,
      },
      vendorName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      menuCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginVertical: 10,
        width: '100%',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 4,
      },
      menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
      },
      menuDetails: {
        fontSize: 14,
        marginBottom: 10,
      },
      buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      addButton: {
        backgroundColor: '#FF914D',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      circleButton: {
        backgroundColor: '#ccc',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
      },
      bottomButtonContainer: {
        backgroundColor: '#2196F3',
        padding: 14,
        marginTop: 5,
        borderRadius: 12,
        zIndex:10,
        elevation:5,        
      },
      bottomButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'      },
    });