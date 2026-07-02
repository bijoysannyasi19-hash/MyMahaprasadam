import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 ,backgroundColor:'#FFF7C0'},
  Container_header:{flex:1,padding:10},
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius:10,
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  modalContainer: {
    width: '80%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  errorText: { color: 'red', fontWeight: 'bold', textAlign: 'center' },
  vendorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
},
shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
vendorImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
},
vendorInfo: {
    flex: 1,
},
vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
},
vendorDescription: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
},
vendorDetail: {
    fontSize: 12,
    color: '#666',
},


});

export default styles;
